export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'users',
        data: {
          menu: {
            title: 'Users',
            icon: 'ion-person',
            selected: true,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'aliases',
        data: {
          menu: {
            title: 'Aliases',
            icon: 'ion-person-stalker',
            selected: false,
            expanded: false,
            order: 1
          }
        }
      }
    ]
  }
];
