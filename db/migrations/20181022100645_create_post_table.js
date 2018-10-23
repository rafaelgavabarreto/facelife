exports.up = function(knex, Promise) {
  return knex.schema.createTable('post', function (table) {
    table.increments('id').primary();
    table.integer('category_id').references('id').inTable('category');
    table.string('preview_picture');
    table.string('header_picture');
    table.string('Title');
    table.string('Article');
    table.string('Footer_picture');
    table.string('Footer_image_tagnote');
    table.string('Meta_data');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('post');
};
