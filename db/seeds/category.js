exports.seed = function(knex, Promise) {
  return knex('category').del()
    .then(function () {
      return Promise.all([
        knex('category').insert({id: 1, name: 'No category'}),
        knex('category').insert({id: 2, name: 'Lifestyle'})
      ]);
    });
};
