'use strict';

/**
 * Card.js controller
 *
 * @description: A set of functions called "actions" for managing `Card`.
 */

module.exports = {

  /**
   * Retrieve card records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.card.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a card record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.card.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an card record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.card.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an card record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.card.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an card record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.card.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
