'use strict';

/**
 * Dashboard.js controller
 *
 * @description: A set of functions called "actions" for managing `Dashboard`.
 */

module.exports = {

  /**
   * Retrieve dashboard records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.dashboard.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a dashboard record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.dashboard.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an dashboard record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.dashboard.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an dashboard record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.dashboard.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an dashboard record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.dashboard.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a dashboard record.
   *
   * @return {Object}
   */

  userDash: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.dashboard.fetchUser(ctx.params);
    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a dashboard record.
   *
   * @return {Object}
   */

  saveTile: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }
    const data = await strapi.services.dashboard.save(ctx.params, ctx.request.body);
    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a dashboard record.
   *
   * @return {Object}
   */

  deleteTile: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }
    const data = await strapi.services.dashboard.delete(ctx.params._id, ctx.params.tile);
    // Send 200 `ok`
    ctx.send(data);
  },
};
