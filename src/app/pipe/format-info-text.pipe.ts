import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatInfoText', 
  standalone: false 
})
@Injectable({ providedIn: 'root' }) 
export class FormatInfoTextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Échapper les caractères HTML
    let escaped = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Mise en gras entre bold=...end
    escaped = escaped.replace(/bold=([\s\S]*?)\s*end/g, (match, boldText) => {
      return `<strong>${boldText.trim()}</strong>`;
    });

    // Souligné entre underline=...end
    escaped = escaped.replace(/underline=([\s\S]*?)\s*end/g, (match, underlinedText) => {
      return `<u>${underlinedText.trim()}</u>`;
    });

    // Liens vers image : name=... image=...
    escaped = escaped.replace(
      /name=([^\n\r]*?)\s+image=([^\s<>,"]+)/g,
      (match, name, path) => {
        return `<a href="#" class="image-link" data-img="${path.trim()}">${name.trim()}</a>`;
      }
    );

    // Liens externes : text=... lien=...
    escaped = escaped.replace(
      /text=([^\n\r]*?)\s+link=(https?:\/\/[^\s<]+)/g,
      (match, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
      }
    );

    // Listes
    escaped = escaped.replace(/^- (.*)$/gm, '<li>$1</li>');
    if (escaped.includes('<li>')) {
      escaped = escaped.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    }

    // Sauts de ligne
    escaped = escaped.replace(/\n/g, '<br>');
    console.log('HTML généré :', escaped);

    return escaped;
  }
}