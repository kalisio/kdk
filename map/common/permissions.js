// Hook computing map abilities for a given user
export function defineUserAbilities (subject, can, cannot) {
  can('service', 'geocoder')
  can('create', 'geocoder')
  can('service', 'catalog')
  can('read', 'catalog')
  can('service', 'projects')
  can('read', 'projects')
  can('service', 'alerts')
  can('read', 'alerts')
  can('service', 'styles')
  can('read', 'styles')
}
