'use strict';

/**
 * Shareddash.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all shareddashes.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    const convertedParams = strapi.utils.models.convertParams('shareddash', params);

    return Shareddash
      .find()
      .where(convertedParams.where)
      .sort(convertedParams.sort)
      .skip(convertedParams.start)
      .limit(convertedParams.limit)
      .populate(_.keys(_.groupBy(_.reject(strapi.models.shareddash.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to fetch a/an shareddash.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    return Shareddash
      .findOne(_.pick(params, _.keys(Shareddash.schema.paths)))
      .populate(_.keys(_.groupBy(_.reject(strapi.models.shareddash.associations, {autoPopulate: false}), 'alias')).join(' '));
  },

  /**
   * Promise to add a/an shareddash.
   *
   * @return {Promise}
   */

  add: async (values) => {
    const data = await Shareddash.create(_.omit(values, _.keys(_.groupBy(strapi.models.shareddash.associations, 'alias'))));
    await strapi.hook.mongoose.manageRelations('shareddash', _.merge(_.clone(data), { values }));
    return data;
  },

  /**
   * Promise to edit a/an shareddash.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Note: The current method will return the full response of Mongo.
    // To get the updated object, you have to execute the `findOne()` method
    // or use the `findOneOrUpdate()` method with `{ new:true }` option.
    await strapi.hook.mongoose.manageRelations('shareddash', _.merge(_.clone(params), { values }));
    return Shareddash.update(params, values, { multi: true });
  },

  /**
   * Promise to remove a/an shareddash.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Shareddash.findOneAndRemove(params, {})
      .populate(_.keys(_.groupBy(_.reject(strapi.models.shareddash.associations, {autoPopulate: false}), 'alias')).join(' '));

    _.forEach(Shareddash.associations, async association => {
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

  fetchDepartment: (params) => {
    const convertedParams = strapi.utils.models.convertParams('shareddash', params);
    return Shareddash
    .find()
    .where({'department': convertedParams.where._id})
    .sort(convertedParams.sort)
    .skip(convertedParams.start)
    .limit(convertedParams.limit)
    .populate(_.keys(_.groupBy(_.reject(strapi.models.dashboard.associations, {autoPopulate: false}), 'alias')).join(' '))   
  }
};
