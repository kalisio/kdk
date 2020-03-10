// Hook computing map abilities for a given user
export function defineUserAbilities (subject, can, cannot) {
  can('service', 'geocoder')
  can('create', 'geocoder')
  can('service', 'catalog')
  can('read', 'catalog')
  can('service', 'alerts')
  can('read', 'alerts')
  // can('service', 'daptiles')
  // can('get', 'daptiles')
}
