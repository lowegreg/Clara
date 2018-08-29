'use strict';

/**
 * Department.js controller
 *
 * @description: A set of functions called "actions" for managing `Department`.
 */

module.exports = {

  /**
   * Retrieve department records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.department.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a department record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.department.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an department record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.department.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an department record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.department.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an department record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.department.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
