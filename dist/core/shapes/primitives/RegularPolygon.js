import ShapeLoop from "../ShapeLoop";
import { EShapePrimitiveAdaptMode } from "../../types/shape-base";
/**
 * Polygon shape
 *
 * @category Core.Primitives
 * @class RegularPolygon
 * @extends {ShapeLoop}
 */
class RegularPolygon extends ShapeLoop {
    constructor(settings = {}) {
        var _a;
        settings.type = settings.type || 'RegularPolygon';
        settings.shapeLoopPropsDependencies = (settings.shapeLoopPropsDependencies || []).concat(['sideNumber']);
        settings.adaptMode = (_a = settings.adaptMode) !== null && _a !== void 0 ? _a : EShapePrimitiveAdaptMode.None;
        super(settings, true);
        this.props.sideNumber = settings.sideNumber;
        this.loop = {
            start: 0,
            end: ShapeLoop.PI2,
            inc: (prop_arguments) => ShapeLoop.PI2 / this.getProp('sideNumber', prop_arguments, 5),
            vertex: shape_loop_repetition => {
                return [Math.cos(shape_loop_repetition.angle), Math.sin(shape_loop_repetition.angle)];
            },
        };
        this.bStaticLoop = this.isStaticLoop();
        this.bStatic = this.isStatic();
        this.bStaticIndexed = this.isStaticIndexed();
    }
    /**
     * Get property value
     *
     * @param {keyof IRegularPolygonProps} key
     * @param {ISceneChildPropArguments} [prop_arguments]
     * @param {*} [default_value]
     * @returns {*}
     * @memberof IRegularPolygonProps
     */
    getProp(key, prop_arguments, default_value) {
        return super.getProp(key, prop_arguments, default_value);
    }
    /**
     * Set single or multiple props
     *
     * @param {(keyof IRegularPolygonProps | RegularPolygonSettings)} key
     * @param {*} [value]
     * @memberof IRegularPolygonProps
     */
    setProp(key, value) {
        super.setProp(key, value);
    }
}
export default RegularPolygon;
//# sourceMappingURL=RegularPolygon.js.map