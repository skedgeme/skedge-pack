module.exports = ({

  title: 'No title created',

  /*
    Tags are represented by objects,
    { someAttri: 'someValue' } becomes <tag someAttri="someValue" />
   */

  meta: [

    { charset: 'utf8' },
    { ['http-equiv']: 'X-UA-Compatible', content: 'IE=edge; chrome=1' },
    { name: 'viewport', content: 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' },
    { name: 'mobile-web-app-capable', content: 'yes'},
    /*
      Some Example Tags One should fill out.
      { name: 'description', content: '' },
      { name: 'author', content: '' },

      { name: 'keywords', content: '' },

      Open Graph Tags, used by facebook and other social sharing sites.
      { property: 'og:type',        content: '' },
      { property: 'og:description', content: '' },
      { property: 'og:image',       content: '' },
      { property: 'og:url',         content: '' },
      { property: 'og:site_name',   content: '' }
    */
  ],

  links: [
    /*
      Favicon
      { rel: 'icon', type: 'image/png', href: 'http://example.com/myicon.png' }

      iPhone and iPad Icons
      { rel: 'apple-touch-icon', href: '' }
      { rel: 'apple-touch-icon', sizes: '76x76', href: '' }
      { rel: 'apple-touch-icon', sizes: '120x120', href: '' }
      { rel: 'apple-touch-icon', sizes: '152x152', href: '' }
    */
  ],

  /* These scripts represent script tags inside of the <head> */
  scripts: [

    /*

    An object works the same as other tags
    { src: 'browser.js', async: true } becomes <script type="application/javascript" src="browser.js" async ></script>

    strings are interpreted as sources so
    'browser.js' becomes <script type="application/javascript" src="browser.js"></script>

    functions get treated as runtime modules
    () => console.log('boot') becomes <script type="application/javascript" >;( () => console.log('boot') )();</script>

    mods are functions which execute within the build and generate code for you.
    For example a google Anaylitics mode would work like this.
    { mod: 'GoogleAnalytics', id: 'XXXXXXXXXXX' } becomes
    <script type="application/javascript" >;( () => {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'XXXXXXXXXXX', 'auto');
      ga('send', 'pageview');
    } )()</script>

    */

  ],

  /* This will contains paths for the build's glob searches to ignore */
  ignore: [
    //'some/path/to/some/file.js'
  ],

});