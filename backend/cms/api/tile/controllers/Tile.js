'use strict';

/**
 * Tile.js controller
 *
 * @description: A set of functions called "actions" for managing `Tile`.
 */

module.exports = {

  /**
   * Retrieve tile records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.tile.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a tile record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.tile.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an tile record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.tile.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an tile record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.tile.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an tile record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.tile.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
