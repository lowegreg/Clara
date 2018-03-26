'use strict';

/**
 * Cards.js controller
 *
 * @description: A set of functions called "actions" for managing `Cards`.
 */

module.exports = {

  /**
   * Retrieve cards records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.cards.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a cards record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.cards.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an cards record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.cards.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an cards record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.cards.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an cards record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.cards.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
