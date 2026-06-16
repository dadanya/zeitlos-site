(function () {
  setTimeout(function () {
    document.documentElement.classList.add('cms-loaded');
  }, 1200);

  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', function (user) {
      if (!user) {
        window.netlifyIdentity.on('login', function () {
          document.location.href = '/admin/';
        });
      }
    });
  }

  if (!window.CMS) return;

  window.CMS.registerPreviewStyle('/admin/preview.css');

  var h = window.h;
  var createClass = window.createClass;
  if (!h || !createClass) return;

  var tagLabels = {
    popular: 'Beliebt',
    ab11: 'Ab 11 Uhr',
    vegan: 'Vegan',
    veggie: 'Vegetarisch',
    'vegan-mgl': 'Vegan möglich',
    seasonal: 'Saisonal'
  };

  function plain(entry) {
    var data = entry && entry.get('data');
    return data && data.toJS ? data.toJS() : {};
  }

  function tags(tagsList) {
    if (!tagsList || !tagsList.length) return null;
    return h('div', { className: 'zeitlos-preview-tags' },
      tagsList.map(function (tag) {
        return h('span', { className: 'zeitlos-preview-tag', key: tag }, tagLabels[tag] || tag);
      })
    );
  }

  var MenuPreview = createClass({
    render: function () {
      var data = plain(this.props.entry);
      var categories = data.categories || [];

      return h('div', { className: 'zeitlos-preview' },
        h('p', { className: 'zeitlos-preview__eyebrow' }, 'Vorschau · Zeitlos Menü'),
        h('h1', null, 'Menü & Preise'),
        categories.map(function (category) {
          var items = (category.items || []).slice(0, 6);
          return h('section', { key: category.id || category.title },
            h('p', { className: 'zeitlos-preview__eyebrow', style: { marginTop: '30px' } }, category.type === 'flip' ? 'Speisenkarte' : 'Getränkekarte'),
            h('h2', null, category.title || 'Kategorie'),
            h('div', { className: 'zeitlos-preview__grid' },
              items.map(function (item) {
                return h('article', { className: 'zeitlos-preview-card', key: item.name },
                  h('div', { className: 'zeitlos-preview-card__top' },
                    h('h3', { className: 'zeitlos-preview-card__name' }, item.name || 'Neuer Eintrag'),
                    h('span', { className: 'zeitlos-preview-card__price' }, item.price || '')
                  ),
                  tags(item.tags),
                  item.desc ? h('p', { className: 'zeitlos-preview-card__text' }, item.desc) : null,
                  item.zutaten ? h('p', { className: 'zeitlos-preview-card__text' }, 'Zutaten: ' + item.zutaten) : null,
                  item.allergene ? h('p', { className: 'zeitlos-preview-card__text' }, 'Allergene: ' + item.allergene) : null
                );
              })
            )
          );
        })
      );
    }
  });

  function textPreview(title, fields) {
    return createClass({
      render: function () {
        var data = plain(this.props.entry);
        return h('div', { className: 'zeitlos-preview' },
          h('p', { className: 'zeitlos-preview__eyebrow' }, 'Vorschau · Zeitlos'),
          h('h1', null, title),
          h('div', { className: 'zeitlos-preview-text' },
            fields.map(function (field) {
              return h('p', { key: field }, data[field] || '');
            })
          )
        );
      }
    });
  }

  var ContactPreview = createClass({
    render: function () {
      var data = plain(this.props.entry);
      var hours = data.hours || [];
      return h('div', { className: 'zeitlos-preview' },
        h('p', { className: 'zeitlos-preview__eyebrow' }, 'Vorschau · Kontakt'),
        h('h1', null, 'Kontakt & Öffnungszeiten'),
        h('div', { className: 'zeitlos-preview-text' },
          h('p', null, data.addressLine1 || ''),
          h('p', null, data.addressLine2 || ''),
          h('p', null, data.phone || ''),
          h('p', null, data.email || ''),
          hours.map(function (row) {
            return h('p', { key: row.dayLabel }, (row.dayLabel || '') + ' · ' + (row.time || ''));
          })
        )
      );
    }
  });

  var GalleryPreview = createClass({
    render: function () {
      var data = plain(this.props.entry);
      var items = data.items || [];
      var getAsset = this.props.getAsset;
      return h('div', { className: 'zeitlos-preview' },
        h('p', { className: 'zeitlos-preview__eyebrow' }, 'Vorschau · Galerie'),
        h('h1', null, 'Galerie & Fotos'),
        h('div', { className: 'zeitlos-preview-gallery' },
          items.map(function (item, index) {
            if (!item.image) {
              return h('div', { className: 'zeitlos-preview-gallery__empty', key: index }, item.title || 'Foto fehlt');
            }
            var asset = getAsset ? getAsset(item.image) : item.image;
            var src = asset && asset.toString ? asset.toString() : item.image;
            return h('img', { key: index, src: src, alt: item.alt || item.title || '' });
          })
        )
      );
    }
  });

  window.CMS.registerPreviewTemplate('menu', MenuPreview);
  window.CMS.registerPreviewTemplate('hero', textPreview('Startbereich', ['eyebrow', 'tagline']));
  window.CMS.registerPreviewTemplate('about', textPreview('Über uns', ['text']));
  window.CMS.registerPreviewTemplate('delivery', textPreview('Bestellen & Lieferung', ['text']));
  window.CMS.registerPreviewTemplate('contact', ContactPreview);
  window.CMS.registerPreviewTemplate('gallery', GalleryPreview);
})();
