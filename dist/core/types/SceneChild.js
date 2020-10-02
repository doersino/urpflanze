/**
 * Repetition type enumerator.
 *
 *
 * @export
 * @enum {number}
 */
export var ERepetitionType;
(function (ERepetitionType) {
    /**
     * Defines the type of repetition of the shape, in a circular way starting from the center of the scene
     */
    ERepetitionType[ERepetitionType["Ring"] = 1] = "Ring";
    /**
     * Defines the type of repetition of the shape, on a nxm grid starting from the center of the scene
     */
    ERepetitionType[ERepetitionType["Matrix"] = 2] = "Matrix";
    /**
     * Defines the type of shape generation
     */
    ERepetitionType[ERepetitionType["Loop"] = 3] = "Loop";
    // Random = 4
})(ERepetitionType || (ERepetitionType = {}));
//# sourceMappingURL=SceneChild.js.map