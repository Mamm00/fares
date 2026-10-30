#!/usr/bin/env python3
"""Build the CyberAr PDF from a local checkout of the original site.

Dependencies: reportlab, beautifulsoup4, arabic-reshaper, python-bidi.
Run: python scripts/build_cyberar_ebook.py /path/to/iraqrahomi.github.io
The source reviewed for this edition is commit b47b703cd0c44cd80b87f6521660aa022b7e3fd0.
"""
import json
import re
import sys
import textwrap
from pathlib import Path
from urllib.parse import urljoin
from zipfile import ZIP_DEFLATED, ZipFile

from arabic_reshaper import reshape
from bidi.algorithm import get_display
from bs4 import BeautifulSoup
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(sys.argv[1])
BASE = 'https://iraqrahomi.github.io/'
FONTDIR = Path('/usr/share/fonts/truetype/dejavu')
pdfmetrics.registerFont(TTFont('Arabic', str(FONTDIR / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('ArabicBold', str(FONTDIR / 'DejaVuSans-Bold.ttf')))
DB = json.loads((SOURCE / 'data/database.json').read_text(encoding='utf8'))
BOOKS = json.loads((SOURCE / 'data/books.json').read_text(encoding='utf8'))
W, H = A4
M = 52
c = canvas.Canvas(str(ROOT / 'CyberAr-ebook.pdf'), pagesize=A4, pageCompression=1)
c.setTitle('CyberAr - الدليل العربي للأمن السيبراني')
c.setAuthor('رحومي البراهيم / CyberAr')
page = 1
y = H - 65


def visual(text):
    # Remove unsupported pictographs, but keep Arabic presentation glyphs.
    text = re.sub(r'[\U00010000-\U0010ffff\u2600-\u27ff]', '', str(text))
    return get_display(reshape(text))


def footer():
    c.setStrokeColor(HexColor('#dbe5ed'))
    c.line(M, 40, W - M, 40)
    c.setFont('Arabic', 8)
    c.setFillColor(HexColor('#64748b'))
    c.drawString(M, 27, 'CyberAr  |  iraqrahomi.github.io')
    c.drawRightString(W-M, 27, str(page))


def new_page():
    global page, y
    footer()
    c.showPage()
    page += 1
    y = H - 65


def ensure(height):
    if y - height < 58:
        new_page()


def wrapped(text, font, size, width):
    words = re.sub(r'\s+', ' ', str(text)).strip().split()
    lines, line = [], ''
    for word in words:
        candidate = (line + ' ' + word).strip()
        if line and pdfmetrics.stringWidth(visual(candidate), font, size) > width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def para(text, size=10.5, color='#334155', bold=False, space=7, ltr=False):
    global y
    if not str(text).strip():
        return
    font = 'ArabicBold' if bold else 'Arabic'
    for line in wrapped(text, font, size, W - 2 * M):
        ensure(size * 1.7)
        c.setFont(font, size)
        c.setFillColor(HexColor(color))
        if ltr and not re.search('[\u0600-\u06ff]', line):
            c.drawString(M, y, line)
        else:
            c.drawRightString(W-M, y, visual(line))
        y -= size * 1.7
    y -= space


def title(text, key=None, fresh=True):
    global y
    if fresh and y < H - 110:
        new_page()
    if key:
        c.bookmarkPage(key)
        c.addOutlineEntry(text, key, 0, False)
    ensure(60)
    c.setFillColor(HexColor('#0f766e'))
    c.roundRect(W-M-36, y, 36, 4, 2, fill=1, stroke=0)
    y -= 27
    para(text, 20, '#0f172a', True, 12)


def sub(text):
    global y
    ensure(48)
    y -= 4
    para(text, 13, '#0f766e', True, 5)


def link(url, label='المصدر الأصلي'):
    global y
    if not url:
        return
    ensure(18)
    text = visual(label)
    c.setFont('Arabic', 9)
    c.setFillColor(HexColor('#2563eb'))
    x = W-M-pdfmetrics.stringWidth(text, 'Arabic', 9)
    c.drawString(x, y, text)
    c.linkURL(url, (x, y-3, W-M, y+12), relative=0)
    y -= 18


def card(name, description='', meta='', url=None):
    sub(name)
    para(description)
    para(meta, 9, '#64748b', space=3)
    link(url)


def article(filename):
    global y
    soup = BeautifulSoup((SOURCE / 'pages' / filename).read_text(encoding='utf8'), 'html.parser')
    root = soup.find('article')
    if root is None:
        return
    title(soup.h1.get_text(' ', strip=True) if soup.h1 else filename)
    link(BASE + 'pages/' + filename)
    for node in root.select('h1,h2,h3,h4,p,li,pre,table,blockquote'):
        if node.name == 'h1' or node.find_parent(['pre', 'table', 'li', 'blockquote']):
            continue
        text = node.get_text('\n' if node.name == 'pre' else ' ', strip=True)
        if not text:
            continue
        if node.name in ('h2', 'h3', 'h4'):
            sub(text)
        elif node.name == 'pre':
            for line in text.splitlines():
                for part in textwrap.wrap(line, width=75, replace_whitespace=False) or ['']:
                    para(part, 9, '#1e3a5f', space=1, ltr=True)
            y -= 5
        elif node.name == 'table':
            for row in node.select('tr'):
                para(' | '.join(cell.get_text(' ', strip=True) for cell in row.select('th,td')), 9, space=3)
        else:
            para(('• ' if node.name == 'li' else '') + text)
    links = []
    for a in root.select('a[href]'):
        url = urljoin(BASE + 'pages/' + filename, a['href'])
        if url.startswith(('http://', 'https://')) and url not in links and not url.startswith(BASE + 'pages/' + filename + '#'):
            links.append(url)
    if links:
        sub('روابط وردت في المقال')
        for url in links:
            link(url, url if len(url) < 75 else 'فتح الرابط')


# Cover
c.setFillColor(HexColor('#0b1728'))
c.rect(0, 0, W, H, fill=1, stroke=0)
c.setFillColor(HexColor('#14b8a6'))
c.roundRect(W-M-80, H-125, 80, 6, 3, fill=1, stroke=0)
c.setFillColor(white)
c.setFont('ArabicBold', 36)
c.drawRightString(W-M, H-210, visual('الدليل العربي'))
c.drawRightString(W-M, H-270, visual('للأمن السيبراني'))
c.setFillColor(HexColor('#a5f3e8'))
c.setFont('Arabic', 15)
c.drawRightString(W-M, H-325, visual('كتاب مرجعي منظّم من محتوى CyberAr'))
c.setFillColor(HexColor('#cbd5e1'))
c.setFont('Arabic', 11)
c.drawRightString(W-M, 160, visual('المصدر: رحومي البراهيم وموقع CyberAr'))
c.showPage()
page = 2
y = H-65
sections = [('paths', 'مسارات التعلم'), ('tools', 'دليل الأدوات'), ('ctf', 'منصات التحديات'), ('resources', 'موارد التعلم والشهادات'), ('books', 'فهرس الكتب'), ('commands', 'مرجع الأوامر'), ('articles', 'المقالات والأدلة'), ('other', 'صفحات إضافية ومصادر'), ('license', 'الترخيص والإسناد')]
title('دليل القراءة والمحتويات', 'intro', False)
para('يجمع هذا الكتاب محتوى الموقع وبياناته وينظمه، مع نسب المقالات إلى صاحبها وروابط للمصادر الأصلية.')
para('للتعلم على الأنظمة المصرّح بها فقط. تحقق من حداثة المعلومات قبل الاستخدام. الكتب الخارجية فهرس فقط ولا تتضمن هذه النسخة ملفاتها؛ صفحة المكتبة تصف التحميل بأنه متاح قريباً.', color='#9a3412')
for index, (key, name) in enumerate(sections, 1):
    ensure(25)
    c.setFont('ArabicBold', 11)
    c.setFillColor(HexColor('#0f766e'))
    c.drawRightString(W-M, y, visual(str(index) + ' / ' + name))
    c.linkRect('', key, (M, y-4, W-M, y+14), relative=0)
    y -= 27

title('مسارات التعلم', 'paths')
for item in DB['paths']:
    sub(item['title'] + ' — ' + item['subtitle'])
    para(item['description'])
    para('المستوى: ' + item['level'] + ' | المدة: ' + item['duration'], 9, '#64748b')
    para('الموضوعات: ' + ' • '.join(item['topics']))
    para('مصادر مقترحة: ' + ' • '.join(item['resources']))
    link(BASE + '#paths')

title('دليل الأدوات', 'tools')
para('مصنفة حسب التخصص ومرتبة أبجدياً داخل كل فئة. الأوصاف من قاعدة بيانات الموقع.')
labels = {'networking': 'الشبكات', 'web': 'تطبيقات الويب', 'exploitation': 'الاستغلال', 'osint': 'استخبارات المصادر المفتوحة', 'wireless': 'الشبكات اللاسلكية', 'forensics': 'التحقيقات الرقمية', 'passwords': 'كلمات المرور'}
for category, items in DB['tools'].items():
    sub(labels.get(category, category))
    for item in sorted(items, key=lambda x: x['name'].lower()):
        card(item['name'], item.get('description', ''), ' | '.join(str(item[k]) for k in ['category', 'platform', 'license', 'difficulty'] if item.get(k)), item.get('website'))

title('منصات التحديات', 'ctf')
for item in sorted(DB['ctf'], key=lambda x: x['name'].lower()):
    card(item['name'], item['description'], ' | '.join(str(item[k]) for k in ['difficulty', 'type', 'language', 'price'] if item.get(k)), item.get('url'))

title('موارد التعلم والشهادات', 'resources')
resource_labels = {'youtube': 'قنوات الفيديو', 'courses': 'الدورات', 'books': 'كتب ومراجع', 'certifications': 'الشهادات المهنية'}
for category, items in DB['resources'].items():
    sub(resource_labels.get(category, category))
    for item in sorted(items, key=lambda x: x.get('name', '').lower()):
        meta = ' | '.join(str(v) for k, v in item.items() if k not in ['name', 'description', 'url', 'website'] and isinstance(v, (str, int)))
        card(item.get('name', ''), item.get('description', ''), meta, item.get('url') or item.get('website'))

title('فهرس الكتب', 'books')
para('العناوين والأوصاف من فهرس الموقع. الإشارة إلى عنوان لا تعني توفر نسخة مجانية أو منح حقوق إعادة توزيع. راجع الناشر أو مكتبة مشروعة.')
for category in BOOKS['categories']:
    items = [item for item in BOOKS['books'] if item['category'] == category['id']]
    if not items:
        continue
    sub(category['title'])
    for item in sorted(items, key=lambda x: x['title'].lower()):
        card(item['title'], item.get('description', ''), ' | '.join([item.get('level', ''), item.get('language', ''), ', '.join(item.get('tags', []))]), urljoin(BASE, item['summaryUrl']) if item.get('summaryUrl') else None)
link(BASE + 'pages/books.html', 'صفحة المكتبة الأصلية')

title('مرجع الأوامر', 'commands')
para('الأوامر من قاعدة بيانات الموقع. نفّذها فقط في بيئة مصرح بها وبعد مراجعة سياقها.')
for category in DB['commands']:
    sub(category['category'])
    for item in category['commands']:
        para(item['cmd'] + ' — ' + item['description'])

title('المقالات والأدلة', 'articles')
para('مقالات الموقع مرتبة من الأساسيات إلى التخصصات ثم مراجعات الكتب والذكاء الاصطناعي. الأكواد والأمثلة للاستخدام القانوني فقط.')
for filename in ['article-kali.html', 'book-hacker-roadmap.html', 'book-comptia-security-plus.html', 'article-owasp.html', 'article-burp.html', 'article-sqli.html', 'book-bug-bounty-rfi.html', 'article-ad.html', 'book-black-hat-python.html', 'linux-book-review.html', 'claude-skills.html']:
    article(filename)

title('صفحات إضافية ومصادر', 'other')
for name, path in [('الرئيسية', 'index.html'), ('الأدوات وملخص Nmap', 'pages/tools.html'), ('التحديات', 'pages/ctf.html'), ('الموارد', 'pages/resources.html'), ('الأوامر', 'pages/commands.html'), ('المقالات', 'pages/blog.html'), ('عن المؤسس', 'pages/about.html')]:
    link(BASE + path, name)
for filename, label in [('tools.html', 'ملخص Nmap من صفحة الأدوات'), ('ctf.html', 'إرشادات إضافية للتحديات'), ('about.html', 'عن CyberAr')]:
    soup = BeautifulSoup((SOURCE / 'pages' / filename).read_text(encoding='utf8'), 'html.parser')
    if filename == 'tools.html':
        root = next((s for s in soup.select('section') if 'NMAP' in s.get_text()), None)
    elif filename == 'ctf.html':
        root = next((s for s in soup.select('section') if s.select('h3')), None)
    else:
        root = soup.select_one('section')
    if root:
        title(label)
        link(BASE + 'pages/' + filename)
        for node in root.select('h2,h3,h4,p,li,.list-row'):
            if node.find_parent(class_='list-row') or node.find_parent('li'):
                continue
            text = node.get_text(' ', strip=True)
            if text:
                sub(text) if node.name in ('h2', 'h3', 'h4') else para(text)
article('deploy.html')

title('الترخيص والإسناد', 'license')
para('المصدر الأصلي: CyberAr، رحومي البراهيم. نُظّم محتوى الموقع مع الإبقاء على روابط الصفحات الأصلية. راجع شروط المصادر الخارجية بصورة مستقلة.')
link(BASE)
sub('MIT License — نص الترخيص الأصلي')
for p in (SOURCE / 'LICENSE').read_text(encoding='utf8').split('\n\n'):
    para(p, 9, space=8, ltr=True)
footer()
c.save()
with ZipFile(ROOT / 'CyberAr-ebook.zip', 'w', ZIP_DEFLATED) as archive:
    archive.write(ROOT / 'CyberAr-ebook.pdf', 'CyberAr-ebook.pdf')
print(f'Created PDF ({page} pages) and ZIP')
