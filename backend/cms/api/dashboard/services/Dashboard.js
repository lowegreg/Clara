'use strict';

/**
 * Dashboard.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all dashboards.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('dashboard', params);

    return Dashboard
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.dashboard.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an dashboard.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Dashboard
      .findOne(_.pick(params, _.keys(Dashboard.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.dashboard.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an dashboard.
   *
   * @return {Promise}
   */

  add: async (values) => {
    const data = await Dashboard.create(_.omit(values, _.keys(_.groupBy(strapi.models.dashboard.associations, 'alias'))));
    await strapi.hook.mongoose.manageRelations('dashboard', _.merge(_.clone(data), { values }));
    return data;
  },

  /**
   * Promise to edit a/an dashboard.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Note: The current method will return the full response of Mongo.
    // To get the updated object, you have to execute the `findOne()` method
    // or use the `findOneOrUpdate()` method with `{ new:true }` option.
    await strapi.hook.mongoose.manageRelations('dashboard', _.merge(_.clone(params), { values }));
    return Dashboard.update(params, values, { multi: true });
  },

  /**
   * Promise to remove a/an dashboard.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Dashboard.findOneAndRemove(params, {})
      .populate(_.keys(_.groupBy(_.reject(strapi.models.dashboard.associations, {autoPopulate: false}), 'alias')).join(' '));

    _.forEach(Dashboard.associations, async association => {
      const search = (_.endsWith(association.nature, 'One')) ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
      const update = (_.endsWith(association.nature, 'One')) ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

      await strapi.models[association.model || association.collection].update(
        search,
        update,
        { multi: true });
    });

    return data;
  },
  /**
   * Promise to fetch all dashboards.
   *
   * @return {Promise}
   */

  fetchUser: (params) => {
    const convertedParams = strapi.utils.models.convertParams('dashboard', params);
    return Dashboard
    .find()
    .where({'user': convertedParams.where._id})
    .sort(convertedParams.sort)
    .skip(convertedParams.start)
    .limit(convertedParams.limit)
    .populate(_.keys(_.groupBy(_.reject(strapi.models.dashboard.associations, {autoPopulate: false}), 'alias')).join(' '))   
  },

  /**
   * Promise to edit a/an dashboard.
   *
   * @return {Promise}
   */

  save: async (params, values) => {
    await strapi.hook.mongoose.manageRelations('dashboard', _.merge(_.clone(params), { values }));
    return Dashboard
    .update(params,{ '$addToSet': {'content' : values.content}}, { multi: true });
  },
  
  /**
  * Promise to edit a/an dashboard.
  *
  * @return {Promise}
  */

 delete: async (params, values) => {
   await strapi.hook.mongoose.manageRelations('dashboard', _.merge(_.clone(params), { values }));
   return Dashboard
   .update({'_id' : params},{ '$pull': {'content' : values}}, { multi: true })
 }
};
