// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BaiHua',
  tagline: '个人文档知识库',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://sreclub.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'likebaihua', // Usually your GitHub org/user name.
  projectName: '', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'BaiHua',
        logo: {
          alt: 'BaiHua Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'devdocs',
            position: 'left',
            label: '运维文档',
          },
          {
            type: 'docSidebar',
            sidebarId: 'opsdocs',
            position: 'left',
            label: '开发文档',
          },
          {to: '/blog', label: '博客文档', position: 'left'},
          {
            href: 'https://github.com/likebaihua',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '本站导航',
            items: [
              {
                label: '运维文档',
                to: '/devdocs',
              },
              {
                label: '开发文档',
                to: '/opsdocs',
              },
            ],
          },
          {
            title: '社区网站',
            items: [
              {
                label: 'Kubernetes',
                to: 'https://kubernetes.io/',
              },
              {
                label: 'Prometheus',
                to: 'https://prometheus.io/',
              },
              {
                label: 'Istio',
                to: 'https://istio.io/',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                to: 'https://github.com/likebaihua/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} BaiHuaweb, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
