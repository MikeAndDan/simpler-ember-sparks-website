import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  tagType: DS.attr('string'),
  priority: DS.attr('number')
})