(function () {
  var adminPath = window.location.pathname.indexOf('/admin/ru') === 0 ? '/admin/ru/' : '/admin/';
  var lang = window.ZEITLOS_ADMIN_LANG === 'ru' ? 'ru' : 'de';
  var labels = {
    de: {
      preview: 'Vorschau',
      menu: 'Zeitlos Menü',
      menuTitle: 'Menü & Preise',
      food: 'Speisenkarte',
      drinks: 'Getränkekarte',
      category: 'Kategorie',
      newItem: 'Neuer Eintrag',
      ingredients: 'Zutaten',
      allergens: 'Allergene',
      zeitlos: 'Zeitlos',
      contact: 'Kontakt',
      contactTitle: 'Kontakt & Öffnungszeiten',
      gallery: 'Galerie',
      galleryTitle: 'Galerie & Fotos',
      missingPhoto: 'Foto fehlt',
      hero: 'Startbereich',
      about: 'Über uns',
      delivery: 'Bestellen & Lieferung'
    },
    ru: {
      preview: 'Предпросмотр',
      menu: 'Меню Zeitlos',
      menuTitle: 'Меню и цены',
      food: 'Еда',
      drinks: 'Напитки',
      category: 'Категория',
      newItem: 'Новая позиция',
      ingredients: 'Состав',
      allergens: 'Аллергены',
      zeitlos: 'Zeitlos',
      contact: 'Контакты',
      contactTitle: 'Контакты и часы работы',
      gallery: 'Галерея',
      galleryTitle: 'Галерея и фото',
      missingPhoto: 'Фото не выбрано',
      hero: 'Главный экран',
      about: 'О нас',
      delivery: 'Заказ и доставка'
    }
  }[lang];

  var tagLabels = lang === 'ru' ? {
    popular: 'Популярное',
    ab11: 'С 11:00',
    vegan: 'Веганское',
    veggie: 'Вегетарианское',
    'vegan-mgl': 'Можно сделать vegan',
    seasonal: 'Сезонное'
  } : {
    popular: 'Beliebt',
    ab11: 'Ab 11 Uhr',
    vegan: 'Vegan',
    veggie: 'Vegetarisch',
    'vegan-mgl': 'Vegan möglich',
    seasonal: 'Saisonal'
  };

  setTimeout(function () {
    document.documentElement.classList.add('cms-loaded');
  }, 1200);

  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('init', function (user) {
      if (!user) {
        window.netlifyIdentity.on('login', function () {
          document.location.href = adminPath;
        });
      }
    });
  }

  if (!window.CMS) return;

  window.CMS.registerPreviewStyle('/admin/preview.css');

  var h = window.h;
  var createClass = window.createClass;
  if (!h || !createClass) return;

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
        h('p', { className: 'zeitlos-preview__eyebrow' }, labels.preview + ' · ' + labels.menu),
        h('h1', null, labels.menuTitle),
        categories.map(function (category) {
          var items = (category.items || []).slice(0, 6);
          return h('section', { key: category.id || category.title },
            h('p', { className: 'zeitlos-preview__eyebrow', style: { marginTop: '30px' } }, category.type === 'flip' ? labels.food : labels.drinks),
            h('h2', null, category.title || labels.category),
            h('div', { className: 'zeitlos-preview__grid' },
              items.map(function (item) {
                return h('article', { className: 'zeitlos-preview-card', key: item.name },
                  h('div', { className: 'zeitlos-preview-card__top' },
                    h('h3', { className: 'zeitlos-preview-card__name' }, item.name || labels.newItem),
                    h('span', { className: 'zeitlos-preview-card__price' }, item.price || '')
                  ),
                  tags(item.tags),
                  item.desc ? h('p', { className: 'zeitlos-preview-card__text' }, item.desc) : null,
                  item.zutaten ? h('p', { className: 'zeitlos-preview-card__text' }, labels.ingredients + ': ' + item.zutaten) : null,
                  item.allergene ? h('p', { className: 'zeitlos-preview-card__text' }, labels.allergens + ': ' + item.allergene) : null
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
          h('p', { className: 'zeitlos-preview__eyebrow' }, labels.preview + ' · ' + labels.zeitlos),
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
        h('p', { className: 'zeitlos-preview__eyebrow' }, labels.preview + ' · ' + labels.contact),
        h('h1', null, labels.contactTitle),
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
        h('p', { className: 'zeitlos-preview__eyebrow' }, labels.preview + ' · ' + labels.gallery),
        h('h1', null, labels.galleryTitle),
        h('div', { className: 'zeitlos-preview-gallery' },
          items.map(function (item, index) {
            if (!item.image) {
              return h('div', { className: 'zeitlos-preview-gallery__empty', key: index }, item.title || labels.missingPhoto);
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
  window.CMS.registerPreviewTemplate('hero', textPreview(labels.hero, ['eyebrow', 'tagline']));
  window.CMS.registerPreviewTemplate('about', textPreview(labels.about, ['text']));
  window.CMS.registerPreviewTemplate('delivery', textPreview(labels.delivery, ['text']));
  window.CMS.registerPreviewTemplate('contact', ContactPreview);
  window.CMS.registerPreviewTemplate('gallery', GalleryPreview);
})();
