"""Browser smoke tests. Run against a local HTTP server, with Playwright installed."""
import json
import os
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('DEMO_BASE_URL', 'http://127.0.0.1:8000').rstrip('/')

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE + '/')
        expect(page.get_by_role('heading', name='Saldanha Labs')).to_be_visible()
        page.get_by_role('link', name='Try the production kit').click()
        page.get_by_label('Episode titles (one per line)').fill('First episode\nSecond episode')
        page.get_by_role('button', name='Generate six files').click()
        expect(page.locator('#kit-downloads button')).to_have_count(6)
        with page.expect_download() as kit_download:
            page.get_by_role('button', name='Download schedule.json').click()
        assert len(json.loads(Path(kit_download.value.path()).read_text())) == 2
        page.go_back()
        page.get_by_label('Episode title').fill('Browser smoke episode')
        page.get_by_label('Publication date').fill('2027-02-03')
        page.get_by_role('button', name='Run example').click()
        expect(page.locator('#result')).to_contain_text('Browser smoke episode')
        expect(page.locator('#result')).to_contain_text('"passed": true')
        page.get_by_role('link', name='View sample presentation').click()
        expect(page.locator('.slide').first).to_be_visible()
        page.go_back()
        page.get_by_role('link', name='Open production board').click()
        expect(page.locator('.item')).to_have_count(3)
        page.get_by_label('Title', exact=True).fill('Browser test card')
        page.get_by_label('Project', exact=True).fill('Fictional project')
        page.get_by_role('button', name='Add item').click()
        card=page.locator('.item').filter(has_text='Browser test card')
        expect(card).to_be_visible()
        card.get_by_role('combobox').select_option('review')
        expect(page.locator('.column').filter(has=page.get_by_role('heading',name='review · 2')).locator('.item').filter(has_text='Browser test card')).to_be_visible()
        page.reload()
        expect(card).to_be_visible()
        with page.expect_download() as download:
            page.get_by_role('button',name='Export JSON').click()
        with tempfile.TemporaryDirectory() as tmp:
            saved=Path(tmp)/'board.json'; download.value.save_as(saved)
            board=json.loads(saved.read_text()); assert len(board)==4 and any(x['title']=='Browser test card' and x['stage']=='review' for x in board)
            page.once('dialog', lambda dialog: dialog.accept())
            card.get_by_role('button',name='Delete').click()
            expect(card).to_have_count(0)
            page.once('dialog',lambda dialog:dialog.accept())
            page.locator('#import').set_input_files(saved)
            expect(card).to_be_visible()
        with page.expect_download() as csv:
            page.get_by_role('button',name='Export CSV').click()
        assert 'Browser test card' in Path(csv.value.path()).read_text()
        page.set_viewport_size({'width':375,'height':812})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Mobile horizontal overflow'
        assert not errors, errors
        browser.close()
    print('Browser smoke tests passed: playground, deck, add/move/persist, JSON/CSV, delete/import, mobile width.')

if __name__=='__main__': run()
