import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatInfoText', 
  standalone: false 
})
export class FormatInfoTextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Échapper les caractères HTML dangereux
    let escaped = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Remplacer les listes (- ...)
    escaped = escaped.replace(/^- (.*)$/gm, '<li>$1</li>');

    // Envelopper les items de liste dans <ul> si au moins un <li> présent
    if (escaped.includes('<li>')) {
      escaped = escaped.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    }

    // Remplacer les sauts de ligne restants par <br>
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
  }
}
