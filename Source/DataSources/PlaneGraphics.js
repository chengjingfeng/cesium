define([
    '../Core/defaultValue',
    '../Core/defined',
    '../Core/defineProperties',
    '../Core/DeveloperError',
    '../Core/Event',
    './createMaterialPropertyDescriptor',
    './createPropertyDescriptor'
], function(
    defaultValue,
    defined,
    defineProperties,
    DeveloperError,
    Event,
    createMaterialPropertyDescriptor,
    createPropertyDescriptor) {
    'use strict';

    /**
     * Describes a plane. The center position and orientation are determined by the containing {@link Entity}.
     *
     * @alias PlaneGraphics
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.dimensions] A {@link Cartesian3} Property specifying the length, width, and height of the box.
     * @param {Property} [options.show=true] A boolean Property specifying the visibility of the box.
     * @param {Property} [options.fill=true] A boolean Property specifying whether the box is filled with the provided material.
     * @param {MaterialProperty} [options.material=Color.WHITE] A Property specifying the material used to fill the box.
     * @param {Property} [options.outline=false] A boolean Property specifying whether the box is outlined.
     * @param {Property} [options.outlineColor=Color.BLACK] A Property specifying the {@link Color} of the outline.
     * @param {Property} [options.outlineWidth=1.0] A numeric Property specifying the width of the outline.
     * @param {Property} [options.shadows=ShadowMode.DISABLED] An enum Property specifying whether the box casts or receives shadows from each light source.
     * @param {Property} [options.distanceDisplayCondition] A Property specifying at what distance from the camera that this box will be displayed.
     *
     * @demo {@link http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Box.html|Cesium Sandcastle Box Demo}
     */
    function PlaneGraphics(options) {
        this._normal = undefined;
        this._normalSubscription = undefined;
        this._distance = undefined;
        this._distanceSubscription = undefined;
        this._dimensions = undefined;
        this._dimensionsSubscription = undefined;
        this._show = undefined;
        this._showSubscription = undefined;
        this._fill = undefined;
        this._fillSubscription = undefined;
        this._material = undefined;
        this._materialSubscription = undefined;
        this._outline = undefined;
        this._outlineSubscription = undefined;
        this._outlineColor = undefined;
        this._outlineColorSubscription = undefined;
        this._outlineWidth = undefined;
        this._outlineWidthSubscription = undefined;
        this._shadows = undefined;
        this._shadowsSubscription = undefined;
        this._distanceDisplayCondition = undefined;
        this._distanceDisplayConditionSubscription = undefined;
        this._definitionChanged = new Event();

        this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
    }

    defineProperties(PlaneGraphics.prototype, {
        /**
         * Gets the event that is raised whenever a property or sub-property is changed or modified.
         * @memberof PlaneGraphics.prototype
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },

        /**
         * Gets or sets the boolean Property specifying the visibility of the box.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default true
         */
        show : createPropertyDescriptor('show'),

        normal : createPropertyDescriptor('normal'),
        distance : createPropertyDescriptor('distance'),
        dimensions : createPropertyDescriptor('dimensions'),

        /**
         * Gets or sets the material used to fill the box.
         * @memberof PlaneGraphics.prototype
         * @type {MaterialProperty}
         * @default Color.WHITE
         */
        material : createMaterialPropertyDescriptor('material'),

        /**
         * Gets or sets the boolean Property specifying whether the box is filled with the provided material.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default true
         */
        fill : createPropertyDescriptor('fill'),

        /**
         * Gets or sets the Property specifying whether the box is outlined.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default false
         */
        outline : createPropertyDescriptor('outline'),

        /**
         * Gets or sets the Property specifying the {@link Color} of the outline.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default Color.BLACK
         */
        outlineColor : createPropertyDescriptor('outlineColor'),

        /**
         * Gets or sets the numeric Property specifying the width of the outline.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default 1.0
         */
        outlineWidth : createPropertyDescriptor('outlineWidth'),

        /**
         * Get or sets the enum Property specifying whether the box
         * casts or receives shadows from each light source.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         * @default ShadowMode.DISABLED
         */
        shadows : createPropertyDescriptor('shadows'),

        /**
         * Gets or sets the {@link DistanceDisplayCondition} Property specifying at what distance from the camera that this box will be displayed.
         * @memberof PlaneGraphics.prototype
         * @type {Property}
         */
        distanceDisplayCondition : createPropertyDescriptor('distanceDisplayCondition')
    });

    /**
     * Duplicates this instance.
     *
     * @param {PlaneGraphics} [result] The object onto which to store the result.
     * @returns {PlaneGraphics} The modified result parameter or a new instance if one was not provided.
     */
    PlaneGraphics.prototype.clone = function(result) {
        if (!defined(result)) {
            return new PlaneGraphics(this);
        }
        result.normal = this.normal;
        result.distance = this.distance;
        result.dimensions = this.dimensions;
        result.show = this.show;
        result.material = this.material;
        result.fill = this.fill;
        result.outline = this.outline;
        result.outlineColor = this.outlineColor;
        result.outlineWidth = this.outlineWidth;
        result.shadows = this.shadows;
        result.distanceDisplayCondition = this.distanceDisplayCondition;
        return result;
    };

    /**
     * Assigns each unassigned property on this object to the value
     * of the same property on the provided source object.
     *
     * @param {PlaneGraphics} source The object to be merged into this object.
     */
    PlaneGraphics.prototype.merge = function(source) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(source)) {
            throw new DeveloperError('source is required.');
        }
        //>>includeEnd('debug');

        this.normal = defaultValue(this.normal, source.normal);
        this.distance = defaultValue(this.distance, source.distance);
        this.dimensions = defaultValue(this.dimensions, source.dimensions);
        this.show = defaultValue(this.show, source.show);
        this.material = defaultValue(this.material, source.material);
        this.fill = defaultValue(this.fill, source.fill);
        this.outline = defaultValue(this.outline, source.outline);
        this.outlineColor = defaultValue(this.outlineColor, source.outlineColor);
        this.outlineWidth = defaultValue(this.outlineWidth, source.outlineWidth);
        this.shadows = defaultValue(this.shadows, source.shadows);
        this.distanceDisplayCondition = defaultValue(this.distanceDisplayCondition, source.distanceDisplayCondition);
    };

    return PlaneGraphics;
});
