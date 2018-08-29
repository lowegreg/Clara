'use strict';

/**
 * Shareddash.js controller
 *
 * @description: A set of functions called "actions" for managing `Shareddash`.
 */

module.exports = {

  /**
   * Retrieve shareddash records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.shareddash.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a shareddash record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.shareddash.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an shareddash record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.shareddash.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an shareddash record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.shareddash.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an shareddash record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.shareddash.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a dashboard record.
   *
   * @return {Object}
   */

  findDepartment: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }
    const data = await strapi.services.shareddash.fetchDepartment(ctx.params);
    // Send 200 `ok`
    ctx.send(data);
  }
};
