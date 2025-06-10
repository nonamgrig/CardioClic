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

    // Liens externes : text=... link=...
    escaped = escaped.replace(
      /text=([^\n\r]*?)\s+link=(https?:\/\/[^\s<]+)/g,
      (match, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
      }
    );

    // Gestion des listes : construire un bloc <ul> avec les <li>
    escaped = escaped.replace(/(?:^- .*(?:\n|$))+?/gm, (match) => {
      const items = match
        .trim()
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => `<li>${line.substring(2).trim()}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    });

    // Sauts de ligne
    escaped = escaped.replace(/\n/g, '<br>');
    console.log('HTML généré :', escaped);

    return escaped;
  }
}