export const PAGES_MENU = [
  {
    path: 'page',
    children: [
      {
        path: 'user',
        data: {
          menu: {
            title: 'Users',
            icon: 'ion-person',
            selected: true,
            expanded: false,
            order: 0
          }
        }
      }
    ]
  }
];
