import { escapeHtml } from './escape-html.util';

describe('escapeHtml', () => {
  it('escapes all HTML-significant characters', () => {
    expect(escapeHtml(`<script>alert('x')</script> & "quoted"`)).toBe(
      '&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt; &amp; &quot;quoted&quot;',
    );
  });

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Nguyen Van A - 0901234567')).toBe(
      'Nguyen Van A - 0901234567',
    );
  });
});
