// Simple HTML escaper to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

// Minimal markdown-it-like implementation without external deps
class SimpleMarkdownParser {
  parse(markdown: string): string {
    let html = markdown;
    
    // Escape HTML first to prevent XSS
    html = escapeHtml(html);
    
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Links - safe href only
    html = html.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
    
    // Code inline
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Tables
    html = this.parseTable(html);
    
    // Block quotes
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Lists
    html = this.parseList(html);
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');

    return `<p>${html}</p>`;
  }

  private parseTable(html: string): string {
    const tableRegex = /\| (.*?) \|\n\| -+ \|\n((?:\| .* \|\n)*)/g;
    return html.replace(tableRegex, (_match: string, header: string, body: string) => {
      const headers = header.split('|').map((h: string) => h.trim()).filter((h: string) => h);
      const rows = body.split('\n').filter((r: string) => r.trim());
      
      let table = '<table><thead><tr>';
      headers.forEach((h: string) => {
        table += `<th>${h}</th>`;
      });
      table += '</tr></thead><tbody>';
      
      rows.forEach((row: string) => {
        const cells = row.split('|').map((c: string) => c.trim()).filter((c: string) => c);
        table += '<tr>';
        cells.forEach((cell: string) => {
          table += `<td>${cell}</td>`;
        });
        table += '</tr>';
      });
      
      table += '</tbody></table>';
      return table;
    });
  }

  private parseList(html: string): string {
    // Unordered lists
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    
    return html;
  }
}

export interface MarkdownOptions {
  theme?: 'light' | 'dark';
  sanitize?: boolean;
}

export class MarkdownRenderer {
  private parser: SimpleMarkdownParser;

  constructor() {
    this.parser = new SimpleMarkdownParser();
  }

  render(markdown: string, options: MarkdownOptions = {}): string {
    const { theme = 'light', sanitize = true } = options;
    
    let html = this.parser.parse(markdown);
    
    if (sanitize) {
      html = this.sanitizeHtml(html);
    }
    
    html = this.applyTheme(html, theme);
    
    return html;
  }

  private sanitizeHtml(html: string): string {
    // Basic HTML sanitization: remove script tags and event handlers
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    html = html.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    return html;
  }

  private applyTheme(html: string, theme: 'light' | 'dark'): string {
    if (theme === 'dark') {
      // Dark mode styles
      html = html.replace(/<h([1-6])>(.*?)<\/h\1>/g, '<h$1 style="color: #e5e7eb;">$2</h$1>');
      html = html.replace(/<p>(.*?)<\/p>/g, '<p style="color: #d1d5db;">$1</p>');
      html = html.replace(/<li>(.*?)<\/li>/g, '<li style="color: #d1d5db;">$1</li>');
      html = html.replace(/<code>(.*?)<\/code>/g, '<code style="background: #374151; color: #10b981; padding: 2px 6px; border-radius: 3px;">$1</code>');
      html = html.replace(/<blockquote>(.*?)<\/blockquote>/g, '<blockquote style="border-left: 4px solid #4b5563; padding-left: 16px; color: #9ca3af;">$1</blockquote>');
      html = html.replace(/<table>/g, '<table style="border-collapse: collapse; width: 100%; border: 1px solid #4b5563;">');
      html = html.replace(/<th>(.*?)<\/th>/g, '<th style="border: 1px solid #4b5563; padding: 8px; background: #374151; color: #d1d5db;">$1</th>');
      html = html.replace(/<td>(.*?)<\/td>/g, '<td style="border: 1px solid #4b5563; padding: 8px; color: #d1d5db;">$1</td>');
      html = html.replace(/<a href="(.*?)">(.*?)<\/a>/g, '<a href="$1" style="color: #60a5fa; text-decoration: underline;">$2</a>');
    } else {
      // Light mode styles
      html = html.replace(/<h([1-6])>(.*?)<\/h\1>/g, '<h$1 style="color: #1f2937;">$2</h$1>');
      html = html.replace(/<p>(.*?)<\/p>/g, '<p style="color: #374151;">$1</p>');
      html = html.replace(/<li>(.*?)<\/li>/g, '<li style="color: #374151;">$1</li>');
      html = html.replace(/<code>(.*?)<\/code>/g, '<code style="background: #f3f4f6; color: #059669; padding: 2px 6px; border-radius: 3px;">$1</code>');
      html = html.replace(/<blockquote>(.*?)<\/blockquote>/g, '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 16px; color: #6b7280;">$1</blockquote>');
      html = html.replace(/<table>/g, '<table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e7eb;">');
      html = html.replace(/<th>(.*?)<\/th>/g, '<th style="border: 1px solid #e5e7eb; padding: 8px; background: #f9fafb; color: #1f2937;">$1</th>');
      html = html.replace(/<td>(.*?)<\/td>/g, '<td style="border: 1px solid #e5e7eb; padding: 8px; color: #374151;">$1</td>');
      html = html.replace(/<a href="(.*?)">(.*?)<\/a>/g, '<a href="$1" style="color: #2563eb; text-decoration: underline;">$2</a>');
    }

    return html;
  }
}

export const markdownRenderer = new MarkdownRenderer();
