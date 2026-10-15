import zipfile, xml.etree.ElementTree as ET, re, json, os

def parse_docx(path):
    with zipfile.ZipFile(path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        chunks = []
        for child in tree.iter():
            tag = child.tag.split('}')[-1]
            if tag == 't' and child.text:
                chunks.append(child.text)
            elif tag in ('br', 'cr'):
                chunks.append('\n')
            elif tag == 'p':
                chunks.append('\n\n')
            elif tag == 'tab':
                chunks.append(' ')
        text = ''.join(chunks).strip()
        text = re.sub(r'\r\n', '\n', text)
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text

def escape_html(s):
    return (s.replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;')
             .replace('"', '&quot;')
             .replace("'", '&#39;'))

# 1. Parse 110 Games
t110 = parse_docx('trochoisinhhoat/110TROCHOISINHHOATVONGTRON.docx')
raw_110 = re.split(r'\n+(?=\d+[\.\-]\s*[A-ZÀ-Ỹ])', t110)
games_110 = []
for g in raw_110:
    g = g.strip()
    if not g or ('110 TRÒ CHƠI' in g and len(g) < 35):
        continue
    lines = g.split('\n')
    title = lines[0].strip()
    body = '\n'.join(lines[1:]).strip()
    games_110.append({'title': title, 'body': body})

# 2. Parse Dung Cu
tdc = parse_docx('trochoisinhhoat/TROCHOICANDUNGCU.docx')
raw_dc = re.split(r'(?=(?:Trò|Trò)\s+số\s+\d+:)', tdc)
games_dc = []
for g in raw_dc:
    g = g.strip()
    if not g or ('TRÒ CHƠI CẦN DỤNG CỤ' in g and len(g) < 30):
        continue
    lines = g.split('\n')
    title = lines[0].strip()
    body = '\n'.join(lines[1:]).strip()
    games_dc.append({'title': title, 'body': body})

# 3. Parse Bang Reo
tbr = parse_docx('bangreosinhhoat/BẢNGEOSINHHOATGIAOLI.docx')
raw_br = re.split(r'\n+(?=\d+[\.\-]\s*)', tbr)
cheers_br = []
for c in raw_br:
    c = c.strip()
    if not c or ('BĂNG REO SINH HOẠT' in c and len(c) < 30):
        continue
    lines = c.split('\n')
    title = lines[0].strip()
    body = '\n'.join(lines[1:]).strip()
    cheers_br.append({'title': title, 'body': body})

# 4. Parse Bai Hat
tbh = parse_docx('baihatsinhhoat/BAIHATSINHHOATVONGTRON.docx')
raw_bh = re.split(r'\n+(?=\d+[\.\-]\s*)', tbh)
songs_bh = []
for s in raw_bh:
    s = s.strip()
    if not s or ('BÀI HÁT SINH HOẠT' in s and len(s) < 30):
        continue
    lines = s.split('\n')
    title = lines[0].strip()
    body = '\n'.join(lines[1:]).strip()
    songs_bh.append({'title': title, 'body': body})

print(f"Extracted: 110={len(games_110)}, DungCu={len(games_dc)}, BangReo={len(cheers_br)}, BaiHat={len(songs_bh)}")

def format_body_html(body, category='trochoi'):
    paras = [p.strip() for p in body.split('\n') if p.strip()]
    html_parts = []
    for p in paras:
        p_esc = escape_html(p)
        if p.startswith('Chú ý:') or p.startswith('* Lưu ý:') or p.startswith('Lưu ý:'):
            html_parts.append(f'<div class="book-note"><i class="fa-solid fa-circle-exclamation text-amber"></i> <strong>Lưu ý:</strong> {p_esc.split(":", 1)[-1].strip()}</div>')
        elif p.startswith('Thí dụ:') or p.startswith('Ví dụ:'):
            html_parts.append(f'<div class="book-example"><i class="fa-solid fa-lightbulb text-info"></i> <strong>Ví dụ:</strong> {p_esc.split(":", 1)[-1].strip()}</div>')
        elif category == 'bangreo' and (' - ' in p or ' – ' in p or '(' in p):
            # Cheer line with action
            parts = re.split(r'\s+[-–]\s+', p, 1)
            if len(parts) == 2:
                call_part = escape_html(parts[0])
                resp_part = escape_html(parts[1])
                html_parts.append(f'<div class="cheer-row"><span class="cheer-call"><i class="fa-solid fa-bullhorn"></i> {call_part}</span> <span class="cheer-resp">&rarr; {resp_part}</span></div>')
            else:
                html_parts.append(f'<p class="cheer-line">{p_esc}</p>')
        elif category == 'baihat':
            html_parts.append(f'<p class="song-verse">{p_esc}</p>')
        else:
            html_parts.append(f'<p class="book-para">{p_esc}</p>')
    return ''.join(html_parts)

def build_pages(book_id, book_title, book_subtitle, items, category='trochoi', items_per_page=2):
    pages = []
    toc = []

    # Page 1: Cover
    pages.append({
        'pageNumber': 1,
        'type': 'cover',
        'chapter': 'Trang Bìa',
        'title': book_title,
        'html': f'''
        <div class="book-cover-page">
            <div class="cover-border">
                <div class="cover-cross"><i class="fa-solid fa-cross"></i></div>
                <div class="cover-org">GIÁO XỨ HOÀ KHÁNH • GIÁO PHẬN ĐÀ NẴNG</div>
                <div class="cover-banner">MAGNIFICATEDU ACADEMY</div>
                <h1 class="cover-title">{escape_html(book_title)}</h1>
                <div class="cover-divider"><i class="fa-solid fa-dove"></i></div>
                <p class="cover-subtitle">{escape_html(book_subtitle)}</p>
                <div class="cover-badges">
                    <span class="cover-badge"><i class="fa-solid fa-layer-group"></i> {len(items)} Nội dung chọn lọc</span>
                    <span class="cover-badge"><i class="fa-solid fa-book-open"></i> Sách lật điện tử</span>
                </div>
                <div class="cover-footer">
                    <div>Lưu hành nội bộ Ban Giáo Lý</div>
                    <small>Phiên bản tra cứu thông minh 2026 - 2027</small>
                </div>
            </div>
        </div>
        '''
    })

    # Page 2: Introduction
    intro_icon = 'fa-gamepad' if category == 'trochoi' else ('fa-bullhorn' if category == 'bangreo' else 'fa-music')
    pages.append({
        'pageNumber': 2,
        'type': 'intro',
        'chapter': 'Lời Mở Đầu',
        'title': 'Lời Mở Đầu & Hướng Dẫn',
        'html': f'''
        <div class="book-intro-page">
            <div class="page-sec-header">
                <span class="sec-tag"><i class="fa-solid {intro_icon}"></i> Tài liệu mục vụ</span>
                <h2 class="sec-heading">Lời Mở Đầu &amp; Ý Lực Sinh Hoạt</h2>
            </div>
            <div class="intro-quote">
                <em>"Hãy vui mừng luôn mãi và không ngừng tạ ơn Chúa trong mọi hoàn cảnh."</em>
                <span>(1 Tx 5, 16-18)</span>
            </div>
            <div class="intro-content">
                <p>Kính thưa quý Cha, quý Tu sĩ, các anh chị Huynh Trưởng và Giáo Lý Viên,</p>
                <p>Tài liệu <strong>{escape_html(book_title)}</strong> được biên soạn công phu nhằm trang bị cho quý anh chị công cụ hoạt náo sinh động, giàu tính giáo dục và đức tin. Mỗi nội dung đều hướng đến việc giúp các em thiếu nhi học mà chơi, chơi mà học, gắn kết tinh thần đồng đội và cảm nghiệm sâu sắc tình thương của Chúa.</p>
                <h4>Nguyên tắc quản trò &amp; sinh hoạt:</h4>
                <ul>
                    <li><strong>Mục đích rõ ràng:</strong> Luôn hướng buổi chơi tới tinh thần yêu thương, kỷ luật và kết hiệp đức tin.</li>
                    <li><strong>Sinh động &amp; cuốn hút:</strong> Quản trò nhiệt thành, rõ ràng, dứt khoát và công minh.</li>
                    <li><strong>An toàn &amp; lành mạnh:</strong> Tuyệt đối tôn trọng nhân phẩm, không dùng hình phạt thô bạo hoặc gây phản cảm.</li>
                    <li><strong>Kết thúc đúng lúc:</strong> Dừng trò chơi khi bầu khí đang ở đỉnh cao phấn khởi để để lại dư âm đẹp.</li>
                </ul>
            </div>
            <div class="intro-sign">
                <strong>Ban Giáo Lý Giáo Xứ Hoà Khánh</strong>
            </div>
        </div>
        '''
    })

    # Page 3: Table of contents (Mục lục)
    # We will generate TOC items
    # Group items into pages (e.g. 2 items per page for trochoi, 2-3 for bangreo, 1-2 for baihat)
    content_pages = []
    curr_items = []
    curr_char_count = 0
    max_chars_per_page = 950 if category == 'trochoi' else (800 if category == 'bangreo' else 650)

    for item in items:
        item_len = len(item['title']) + len(item['body'])
        if curr_items and (len(curr_items) >= items_per_page or (curr_char_count + item_len > max_chars_per_page)):
            content_pages.append(curr_items)
            curr_items = [item]
            curr_char_count = item_len
        else:
            curr_items.append(item)
            curr_char_count += item_len

    if curr_items:
        content_pages.append(curr_items)

    start_page = 4  # Page 3 is TOC

    # Build TOC list
    toc_html_items = []
    p_num = start_page
    for group in content_pages:
        for it in group:
            toc.append({
                'title': it['title'],
                'page': p_num
            })
            toc_html_items.append(f'''
            <li class="toc-item" onclick="window.flipbookGoToPage({p_num})">
                <span class="toc-title">{escape_html(it['title'])}</span>
                <span class="toc-dots"></span>
                <span class="toc-page">{p_num}</span>
            </li>
            ''')
        p_num += 1

    # Add TOC page
    pages.append({
        'pageNumber': 3,
        'type': 'toc',
        'chapter': 'Mục Lục',
        'title': 'Mục Lục Tra Cứu',
        'html': f'''
        <div class="book-toc-page">
            <div class="page-sec-header">
                <span class="sec-tag"><i class="fa-solid fa-list-ol"></i> Tra cứu nhanh</span>
                <h2 class="sec-heading">Mục Lục Danh Sách ({len(items)} Mục)</h2>
            </div>
            <p class="toc-hint"><i class="fa-solid fa-hand-pointer"></i> Bấm vào bất kỳ mục nào để lật nhanh đến trang đó:</p>
            <div class="toc-scroll-container">
                <ul class="toc-list">
                    {''.join(toc_html_items[:40])}
                </ul>
                {f'<p class="toc-more">...và {len(items)-40} mục tiếp theo trong các trang sau (sử dụng thanh Mục lục bên dưới hoặc menu để xem trọn vẹn).</p>' if len(items) > 40 else ''}
            </div>
        </div>
        '''
    })

    # Add Content Pages
    p_num = start_page
    for group in content_pages:
        items_html = []
        for it in group:
            badge_icon = 'fa-puzzle-piece' if category == 'trochoi' else ('fa-bullhorn' if category == 'bangreo' else 'fa-music')
            items_html.append(f'''
            <div class="book-item-block">
                <div class="item-block-header">
                    <span class="item-icon-tag"><i class="fa-solid {badge_icon}"></i></span>
                    <h3 class="item-block-title">{escape_html(it['title'])}</h3>
                </div>
                <div class="item-block-body">
                    {format_body_html(it['body'], category)}
                </div>
            </div>
            ''')

        pages.append({
            'pageNumber': p_num,
            'type': 'content',
            'chapter': group[0]['title'],
            'title': group[0]['title'],
            'html': f'''
            <div class="book-content-page page-{category}">
                <div class="book-page-header">
                    <span class="page-running-head">{escape_html(book_title)}</span>
                    <span class="page-cat-badge">{escape_html(category.upper())}</span>
                </div>
                <div class="book-items-wrap">
                    {''.join(items_html)}
                </div>
                <div class="book-page-footer">
                    <span>MagnificatEdu • Giáo Xứ Hoà Khánh</span>
                    <span class="footer-page-num">{p_num}</span>
                </div>
            </div>
            '''
        })
        p_num += 1

    # Final Closing Page
    pages.append({
        'pageNumber': p_num,
        'type': 'conclusion',
        'chapter': 'Lời Kết',
        'title': 'Lời Kết & Tạ Ơn',
        'html': f'''
        <div class="book-conclusion-page">
            <div class="page-sec-header text-center">
                <div class="conclusion-icon"><i class="fa-solid fa-heart-circle-check text-danger"></i></div>
                <h2 class="sec-heading">Tạ Ơn &amp; Lên Đường</h2>
            </div>
            <div class="conclusion-body">
                <p><em>"Lạy Chúa Giêsu Thánh Thể, chúng con tạ ơn Chúa vì niềm vui hiệp nhất và những tiếng cười rộn rã Chúa đã ban trong buổi sinh hoạt hôm nay."</em></p>
                <p>Nguyện xin Chúa chúc lành cho sứ vụ của quý Cha, quý Tu sĩ và toàn thể anh chị em Giáo Lý Viên &amp; Huynh Trưởng. Chúc các bạn luôn giữ trọn nhiệt huyết tông đồ và tinh thần phụng sự hy sinh!</p>
                <div class="conclusion-seal">
                    <i class="fa-solid fa-shield-halved"></i>
                    <strong>MAGNIFICATEDU</strong>
                    <small>Nền Tảng Giáo Lý Số Hoá 2026</small>
                </div>
            </div>
            <div class="book-page-footer">
                <span>Hết tài liệu • {len(items)} Mục trọn vẹn</span>
                <span class="footer-page-num">{p_num}</span>
            </div>
        </div>
        '''
    })

    return pages, toc

# Build books
pages_110, toc_110 = build_pages('doc-tc-110', '110 TRÒ CHƠI SINH HOẠT VÒNG TRÒN', 'Tuyển tập 110 trò chơi vòng tròn không cần dụng cụ, sinh động & gắn kết', games_110, 'trochoi', items_per_page=2)
pages_dc, toc_dc = build_pages('doc-tc-dungcu', 'TRÒ CHƠI CẦN DỤNG CỤ', 'Tuyển tập 9 trò chơi thi đua tiếp sức, vận động & hào hứng', games_dc, 'trochoi', items_per_page=1)
pages_br, toc_br = build_pages('doc-br-giaoli', 'BĂNG REO SINH HOẠT GIÁO LÝ', '68 băng reo cử điệu Giáo Lý, Kinh Thánh & Thánh Thể', cheers_br, 'bangreo', items_per_page=2)
pages_bh, toc_bh = build_pages('doc-bh-vongtron', 'BÀI HÁT SINH HOẠT VÒNG TRÒN', '20 ca khúc sinh hoạt, khởi động, lửa trại & kết đoàn', songs_bh, 'baihat', items_per_page=2)

print(f"Pages: 110={len(pages_110)}, dc={len(pages_dc)}, br={len(pages_br)}, bh={len(pages_bh)}")

documents = [
    {
        'id': 'doc-tc-110',
        'category': 'trochoi',
        'categoryName': 'Trò chơi sinh hoạt',
        'folder': 'trochoisinhhoat',
        'title': '110 Trò Chơi Sinh Hoạt Vòng Tròn',
        'subtitle': 'Tuyển tập 110 trò chơi vòng tròn không cần dụng cụ',
        'format': 'docx',
        'icon': 'fa-solid fa-gamepad',
        'docxUrl': 'trochoisinhhoat/110TROCHOISINHHOATVONGTRON.docx',
        'pdfUrl': 'trochoisinhhoat/110TROCHOISINHHOATVONGTRON.pdf',
        'itemCount': len(games_110),
        'badge': f'{len(games_110)} Trò chơi',
        'fileSize': '49 KB',
        'pagesCount': len(pages_110),
        'desc': 'Tuyển tập 110 trò chơi vòng tròn phong phú, không đòi hỏi đạo cụ phức tạp, phù hợp cho mọi lứa tuổi từ Khai Tâm đến Vào Đời.',
        'pages': pages_110,
        'toc': toc_110
    },
    {
        'id': 'doc-tc-dungcu',
        'category': 'trochoi',
        'categoryName': 'Trò chơi sinh hoạt',
        'folder': 'trochoisinhhoat',
        'title': 'Tuyển Tập Trò Chơi Cần Dụng Cụ',
        'subtitle': '9 trò chơi thi đua tiếp sức cực kỳ hấp dẫn',
        'format': 'docx',
        'icon': 'fa-solid fa-shapes',
        'docxUrl': 'trochoisinhhoat/TROCHOICANDUNGCU.docx',
        'pdfUrl': 'trochoisinhhoat/TROCHOICANDUNGCU.pdf',
        'itemCount': len(games_dc),
        'badge': f'{len(games_dc)} Trò chơi dụng cụ',
        'fileSize': '16 KB',
        'pagesCount': len(pages_dc),
        'desc': 'Các trò chơi thi đua đồng đội dùng bao bố, bong bóng, gậy, quạt, thau nước mang lại bầu khí sôi nổi tột đỉnh.',
        'pages': pages_dc,
        'toc': toc_dc
    },
    {
        'id': 'doc-tc-cophat',
        'category': 'trochoi',
        'categoryName': 'Trò chơi sinh hoạt',
        'folder': 'trochoisinhhoat',
        'title': 'Trò Chơi Sinh Hoạt Có Hình Phạt',
        'subtitle': 'Trò chơi vui nhộn kèm các hình phạt dí dỏm, văn minh',
        'format': 'pdf',
        'icon': 'fa-solid fa-face-laugh-squint',
        'docxUrl': 'trochoisinhhoat/TROCHOISINHHOATCOPHAT.docx',
        'pdfUrl': 'trochoisinhhoat/TROCHOISINHHOATCOPHAT.pdf',
        'itemCount': 15,
        'badge': 'Bản PDF chuẩn (11 trang)',
        'fileSize': '295 KB',
        'pagesCount': 11,
        'desc': 'Tài liệu hướng dẫn các trò chơi tạo bất ngờ và tuyển tập các hình phạt hài hước, lành mạnh, giáo dục cho thiếu nhi.',
        'pages': [],
        'toc': []
    },
    {
        'id': 'doc-tc-vongtron1',
        'category': 'trochoi',
        'categoryName': 'Trò chơi sinh hoạt',
        'folder': 'trochoisinhhoat',
        'title': 'Trò Chơi Sinh Hoạt Vòng Tròn - Tuyển Tập 1',
        'subtitle': 'Bộ sưu tập trò chơi phản xạ và giao lưu vòng tròn',
        'format': 'pdf',
        'icon': 'fa-solid fa-users',
        'docxUrl': 'trochoisinhhoat/TROCHOISINHHOATVONGTRON1.docx',
        'pdfUrl': 'trochoisinhhoat/TROCHOISINHHOATVONGTRON1.pdf',
        'itemCount': 25,
        'badge': 'Bản PDF chuẩn (11 trang)',
        'fileSize': '183 KB',
        'pagesCount': 11,
        'desc': 'Tổng hợp các trò chơi vòng tròn khởi động, làm quen, tạo bầu khí thân ái cho sa mạc huấn luyện và ngày hội vui.',
        'pages': [],
        'toc': []
    },
    {
        'id': 'doc-tc-2',
        'category': 'trochoi',
        'categoryName': 'Trò chơi sinh hoạt',
        'folder': 'trochoisinhhoat',
        'title': 'Trò Chơi Sinh Hoạt Tuyển Chọn - Tập 2',
        'subtitle': 'Cẩm nang trò chơi sinh hoạt TNTT & Giáo Lý Viên',
        'format': 'pdf',
        'icon': 'fa-solid fa-file-pdf',
        'docxUrl': 'trochoisinhhoat/TROCHOISINHHOAT2.docx',
        'pdfUrl': 'trochoisinhhoat/TROCHOISINHHOAT2.pdf',
        'itemCount': 35,
        'badge': 'Bản PDF chuẩn (18 trang)',
        'fileSize': '1.08 MB',
        'pagesCount': 18,
        'desc': 'Bộ tài liệu dày 18 trang tuyển tập các trò chơi sinh hoạt vận động, rèn luyện trí tuệ, phản xạ và tinh thần tông đồ.',
        'pages': [],
        'toc': []
    },
    {
        'id': 'doc-br-giaoli',
        'category': 'bangreo',
        'categoryName': 'Băng reo sinh hoạt',
        'folder': 'bangreosinhhoat',
        'title': 'Tuyển Tập Băng Reo Sinh Hoạt Giáo Lý',
        'subtitle': '68 băng reo cử điệu đức tin, Kinh Thánh & Thánh Thể',
        'format': 'docx',
        'icon': 'fa-solid fa-bullhorn',
        'docxUrl': 'bangreosinhhoat/BẢNGEOSINHHOATGIAOLI.docx',
        'pdfUrl': 'bangreosinhhoat/BANGREOSINHHOATGIAOLI.pdf',
        'itemCount': len(cheers_br),
        'badge': f'{len(cheers_br)} Băng reo Giáo lý',
        'fileSize': '31 KB',
        'pagesCount': len(pages_br),
        'desc': 'Bộ sưu tập 68 bài băng reo đặc sắc dành riêng cho sinh hoạt Giáo lý: Thánh Thể, Chúa Ba Ngôi, Phúc Thật, Manna...',
        'pages': pages_br,
        'toc': toc_br
    },
    {
        'id': 'doc-bh-vongtron',
        'category': 'baihat',
        'categoryName': 'Bài hát sinh hoạt',
        'folder': 'baihatsinhhoat',
        'title': 'Tuyển Tập Bài Hát Sinh Hoạt Vòng Tròn',
        'subtitle': '20 bài hát sinh hoạt quen thuộc, gắn kết & hào hứng',
        'format': 'docx',
        'icon': 'fa-solid fa-music',
        'docxUrl': 'baihatsinhhoat/BAIHATSINHHOATVONGTRON.docx',
        'pdfUrl': 'baihatsinhhoat/BAIHATSINHHOATVONGTRON.pdf',
        'itemCount': len(songs_bh),
        'badge': f'{len(songs_bh)} Bài hát vòng tròn',
        'fileSize': '17 KB',
        'pagesCount': len(pages_bh),
        'desc': 'Lời bài hát các ca khúc sinh hoạt vòng tròn: Nào về đây, Bốn phương trời, Vòng tròn, Quây quần, Bên nhau...',
        'pages': pages_bh,
        'toc': toc_bh
    },
    {
        'id': 'doc-bh-1',
        'category': 'baihat',
        'categoryName': 'Bài hát sinh hoạt',
        'folder': 'baihatsinhhoat',
        'title': 'Tuyển Tập Bài Hát Sinh Hoạt - Phần 1',
        'subtitle': 'Tài liệu bài hát sinh hoạt & cử điệu huynh trưởng',
        'format': 'pdf',
        'icon': 'fa-solid fa-file-audio',
        'docxUrl': 'baihatsinhhoat/BAIHATSINHHOAT1.docx',
        'pdfUrl': 'baihatsinhhoat/BAIHATSINHHOAT1.pdf',
        'itemCount': 12,
        'badge': 'Bản PDF chuẩn (3 trang)',
        'fileSize': '254 KB',
        'pagesCount': 3,
        'desc': 'Các bài hát sinh hoạt mở đầu, chào mừng và tạo sự thân thiện, hòa đồng trong các buổi họp đoàn thiếu nhi.',
        'pages': [],
        'toc': []
    },
    {
        'id': 'doc-bh-2',
        'category': 'baihat',
        'categoryName': 'Bài hát sinh hoạt',
        'folder': 'baihatsinhhoat',
        'title': 'Tuyển Tập Bài Hát Sinh Hoạt - Phần 2',
        'subtitle': 'Tuyển tập ca khúc lửa trại, sa mạc & hành trình đức tin',
        'format': 'pdf',
        'icon': 'fa-solid fa-campground',
        'docxUrl': 'baihatsinhhoat/BAIHATSINHHOAT2.docx',
        'pdfUrl': 'baihatsinhhoat/BAIHATSINHHOAT2.pdf',
        'itemCount': 40,
        'badge': 'Bản PDF chuẩn (25 trang)',
        'fileSize': '2.05 MB',
        'pagesCount': 25,
        'desc': 'Tập bài hát sinh hoạt quy mô lớn dày 25 trang, gồm bài ca lửa trại, hành trình đức tin và các bài ca dấn thân lên đường.',
        'pages': [],
        'toc': []
    }
]

js_content = f'''// ACTIVITIES LIBRARY DATA (MAGNIFICATEDU)
// Tự động trích xuất và tối ưu hóa từ các thư mục: trochoisinhhoat, bangreosinhhoat, baihatsinhhoat

window.ACTIVITIES_CATEGORIES = [
  {{
    id: 'all',
    name: 'Tất Cả Học Liệu',
    icon: 'fa-solid fa-border-all',
    desc: 'Toàn bộ 9 tuyển tập trò chơi, bài hát và băng reo'
  }},
  {{
    id: 'trochoi',
    name: 'Trò Chơi Sinh Hoạt',
    icon: 'fa-solid fa-gamepad',
    desc: '5 tuyển tập trò chơi vòng tròn, trò chơi có dụng cụ và trò chơi có phạt'
  }},
  {{
    id: 'bangreo',
    name: 'Băng Reo Sinh Hoạt',
    icon: 'fa-solid fa-bullhorn',
    desc: '68 băng reo cử điệu Giáo Lý, Kinh Thánh & Thánh Thể'
  }},
  {{
    id: 'baihat',
    name: 'Bài Hát Sinh Hoạt',
    icon: 'fa-solid fa-music',
    desc: '3 tuyển tập bài hát sinh hoạt vòng tròn, họp đoàn và lửa trại'
  }}
];

window.ACTIVITIES_DOCUMENTS = {json.dumps(documents, ensure_ascii=False, indent=2)};
'''

with open('activities_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"activities_data.js written successfully! Size={len(js_content):,} chars")
