(function () {
  const h = window.React.createElement;

  const ArticlePreview = (props) => {
    const entry = props.entry;
    const titre = entry.getIn(['data', 'titre']) || 'Titre de prévisualisation';
    const soustitre = entry.getIn(['data', 'soustitre']) || '';
    const cat = entry.getIn(['data', 'cat']) || 'Catégorie';
    const verset = entry.getIn(['data', 'verset']) || '';
    const intro = entry.getIn(['data', 'intro']) || '';
    const body = props.widgetFor('body');

    return h(
      'div',
      { style: { fontFamily: 'Georgia, serif', maxWidth: '760px', margin: '0 auto', padding: '40px 20px', color: '#261c14' } },
      h('p', { style: { textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a6e28', fontSize: '12px', fontFamily: 'Arial, sans-serif' } }, cat),
      h('h1', { style: { fontSize: '38px', lineHeight: '1.2', marginBottom: '8px' } }, titre),
      soustitre ? h('p', { style: { fontSize: '20px', color: '#6f6252', marginTop: 0 } }, soustitre) : null,
      h('p', { style: { color: '#6f6252', fontFamily: 'Arial, sans-serif', fontSize: '14px' } }, verset),
      intro ? h('p', { style: { fontSize: '18px', color: '#6f6252', lineHeight: '1.7', marginBottom: '28px' } }, intro) : null,
      h('div', { style: { fontSize: '18px', lineHeight: '1.8' } }, body)
    );
  };

  window.CMS.registerPreviewTemplate('posts', ArticlePreview);
})();
