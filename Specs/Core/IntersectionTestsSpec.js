define([
        'Core/IntersectionTests',
        'Core/BoundingSphere',
        'Core/Cartesian3',
        'Core/Ellipsoid',
        'Core/Math',
        'Core/Plane',
        'Core/Ray'
    ], function(
        IntersectionTests,
        BoundingSphere,
        Cartesian3,
        Ellipsoid,
        CesiumMath,
        Plane,
        Ray) {
        'use strict';

describe('Core/IntersectionTests', function() {

    it('rayPlane intersects', function() {
        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        var plane = new Plane(Cartesian3.UNIT_X, -1.0);

        var intersectionPoint = IntersectionTests.rayPlane(ray, plane);

        expect(intersectionPoint).toEqual(new Cartesian3(1.0, 0.0, 0.0));
    });

    it('rayPlane misses', function() {
        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        var plane = new Plane(Cartesian3.UNIT_X, -1.0);

        var intersectionPoint = IntersectionTests.rayPlane(ray, plane);

        expect(intersectionPoint).not.toBeDefined();
    });

    it('rayPlane misses (parallel)', function() {
        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        var plane = new Plane(Cartesian3.UNIT_X, -1.0);

        var intersectionPoint = IntersectionTests.rayPlane(ray, plane);

        expect(intersectionPoint).not.toBeDefined();
    });

    it('rayPlane throws without ray', function() {
        expect(function() {
            IntersectionTests.rayPlane();
        }).toThrowDeveloperError();
    });

    it('rayPlane throws without plane', function() {
        expect(function() {
            IntersectionTests.rayPlane(new Ray(new Cartesian3(), new Cartesian3()));
        }).toThrowDeveloperError();
    });

    it('rayTriangle throws without ray', function() {
        expect(function() {
            IntersectionTests.rayTriangle();
        }).toThrowDeveloperError();
    });

    it('rayTriangle throws without p0', function() {
        expect(function() {
            IntersectionTests.rayTriangle(new Ray());
        }).toThrowDeveloperError();
    });

    it('rayTriangle throws without p1', function() {
        expect(function() {
            IntersectionTests.rayTriangle(new Ray(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('rayTriangle throws without p2', function() {
        expect(function() {
            IntersectionTests.rayTriangle(new Ray(), new Cartesian3(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('rayTriangle intersects front face', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(Cartesian3.UNIT_Z, Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()));

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).toEqual(Cartesian3.ZERO);
    });

    it('rayTriangle intersects back face without culling', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), Cartesian3.UNIT_Z);

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).toEqual(Cartesian3.ZERO);
    });

    it('rayTriangle does not intersect back face with culling', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), Cartesian3.UNIT_Z);

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2, true);
        expect(intersection).not.toBeDefined();
    });

    it('rayTriangle does not intersect outside the 0-1 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(new Cartesian3(0.0, -1.0, 1.0), Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()));

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('rayTriangle does not intersect outside the 1-2 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(new Cartesian3(1.0, 1.0, 1.0), Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()));

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('rayTriangle does not intersect outside the 2-0 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(new Cartesian3(-1.0, 1.0, 1.0), Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()));

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('rayTriangle does not intersect parallel ray and triangle', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(new Cartesian3(-1.0, 0.0, 1.0), Cartesian3.UNIT_X);

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('rayTriangle does not intersect behind the ray origin', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var ray = new Ray(Cartesian3.UNIT_Z, Cartesian3.UNIT_Z);

        var intersection = IntersectionTests.rayTriangle(ray, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle throws without v0', function() {
        expect(function() {
            IntersectionTests.lineSegmentTriangle();
        }).toThrowDeveloperError();
    });

    it('lineSegmentTriangle throws without v1', function() {
        expect(function() {
            IntersectionTests.lineSegmentTriangle(new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('lineSegmentTriangle throws without p0', function() {
        expect(function() {
            IntersectionTests.lineSegmentTriangle(new Cartesian3(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('lineSegmentTriangle throws without p1', function() {
        expect(function() {
            IntersectionTests.lineSegmentTriangle(new Cartesian3(), new Cartesian3(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('lineSegmentTriangle throws without p2', function() {
        expect(function() {
            IntersectionTests.lineSegmentTriangle(new Cartesian3(), new Cartesian3(), new Cartesian3(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('lineSegmentTriangle intersects front face', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = Cartesian3.UNIT_Z;
        var v1 = Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).toEqual(Cartesian3.ZERO);
    });

    it('lineSegmentTriangle intersects back face without culling', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3());
        var v1 = Cartesian3.UNIT_Z;

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).toEqual(Cartesian3.ZERO);
    });

    it('lineSegmentTriangle does not intersect back face with culling', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3());
        var v1 = Cartesian3.UNIT_Z;

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2, true);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect outside the 0-1 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = new Cartesian3(0.0, -1.0, 1.0);
        var v1 = Cartesian3.add(v0, Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect outside the 1-2 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = new Cartesian3(1.0, 1.0, 1.0);
        var v1 = Cartesian3.add(v0, Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect outside the 2-0 edge', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = new Cartesian3(-1.0, 1.0, 1.0);
        var v1 = Cartesian3.add(v0, Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect parallel ray and triangle', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = new Cartesian3(-1.0, 0.0, 1.0);
        var v1 = Cartesian3.add(v0, Cartesian3.UNIT_X, new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect behind the v0', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = Cartesian3.UNIT_Z;
        var v1 = Cartesian3.multiplyByScalar(Cartesian3.UNIT_Z, 2.0, new Cartesian3());

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('lineSegmentTriangle does not intersect behind the v1', function() {
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 0.0);

        var v0 = Cartesian3.multiplyByScalar(Cartesian3.UNIT_Z, 2.0, new Cartesian3());
        var v1 = Cartesian3.UNIT_Z;

        var intersection = IntersectionTests.lineSegmentTriangle(v0, v1, p0, p1, p2);
        expect(intersection).not.toBeDefined();
    });

    it('raySphere throws without ray', function() {
        expect(function() {
            IntersectionTests.raySphere();
        }).toThrowDeveloperError();
    });

    it('raySphere throws without ellipsoid', function() {
        expect(function() {
            IntersectionTests.raySphere(new Ray());
        }).toThrowDeveloperError();
    });

    it('raySphere outside intersections', function() {
        var unitSphere = new BoundingSphere(Cartesian3.ZERO, 1.0);

        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        var intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 0.0, 2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(1.0, 1.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-2.0, 0.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, -2.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, 1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-1.0, -1.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-2.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(0.0, -2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(0.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();
    });

    it('raySphere ray inside pointing in intersection', function() {
        var sphere = new BoundingSphere(Cartesian3.ZERO, 5000.0);

        var origin = new Cartesian3(200.0, 0.0, 0.0);
        var direction = Cartesian3.negate(Cartesian3.normalize(origin, new Cartesian3()), new Cartesian3());
        var ray = new Ray(origin, direction);

        var expected = {
            start : 0.0,
            stop : sphere.radius + origin.x
        };
        var actual = IntersectionTests.raySphere(ray, sphere);

        expect(actual).toBeDefined();
        expect(actual.start).toEqual(expected.start);
        expect(actual.stop).toEqual(expected.stop);
    });

    it('raySphere ray inside pointing out intersection', function() {
        var sphere = new BoundingSphere(Cartesian3.ZERO, 5000.0);

        var origin = new Cartesian3(200.0, 0.0, 0.0);
        var direction = Cartesian3.normalize(origin, new Cartesian3());
        var ray = new Ray(origin, direction);

        var expected = {
                start : 0.0,
                stop : sphere.radius - origin.x
        };
        var actual = IntersectionTests.raySphere(ray, sphere);

        expect(actual).toBeDefined();
        expect(actual.start).toEqual(expected.start);
        expect(actual.stop).toEqual(expected.stop);
    });

    it('raySphere tangent intersections', function() {
        var unitSphere = new BoundingSphere(Cartesian3.ZERO, 1.0);

        var ray = new Ray(Cartesian3.UNIT_X, Cartesian3.UNIT_Z);
        var intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).not.toBeDefined();
    });

    it('raySphere no intersections', function() {
        var unitSphere = new BoundingSphere(Cartesian3.ZERO, 1.0);

        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 0.0, 1.0));
        var intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).not.toBeDefined();
    });

    it('raySphere intersection with sphere center not the origin', function() {
        var unitSphere = new BoundingSphere(new Cartesian3(200.0, 0.0, 0.0), 1.0);

        var ray = new Ray(new Cartesian3(202.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        var intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(200.0, 2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(200.0, 0.0, 2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(201.0, 1.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(198.0, 0.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(200.0, -2.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(200.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, 1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(199.0, -1.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(198.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(200.0, -2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(200.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.raySphere(ray, unitSphere);
        expect(intersections).toBeUndefined();
    });

    it('rayEllipsoid throws without ray', function() {
        expect(function() {
            IntersectionTests.rayEllipsoid();
        }).toThrowDeveloperError();
    });

    it('rayEllipsoid throws without ellipsoid', function() {
        expect(function() {
            IntersectionTests.rayEllipsoid(new Ray(new Cartesian3(), new Cartesian3()));
        }).toThrowDeveloperError();
    });

    it('rayEllipsoid outside intersections', function() {
        var unitSphere = Ellipsoid.UNIT_SPHERE;

        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        var intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 0.0, 2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(1.0, 1.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-2.0, 0.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, -2.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(0.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, 1.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);
        expect(intersections.stop).toEqualEpsilon(3.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-1.0, -1.0, 0.0), new Cartesian3(1.0, 0.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections.start).toEqualEpsilon(1.0, CesiumMath.EPSILON14);

        ray = new Ray(new Cartesian3(-2.0, 0.0, 0.0), new Cartesian3(-1.0, 0.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(0.0, -2.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).toBeUndefined();

        ray = new Ray(new Cartesian3(0.0, 0.0, -2.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).toBeUndefined();
    });

    it('rayEllipsoid ray inside pointing in intersection', function() {
        var ellipsoid = Ellipsoid.WGS84;

        var origin = new Cartesian3(20000.0, 0.0, 0.0);
        var direction = Cartesian3.negate(Cartesian3.normalize(origin, new Cartesian3()), new Cartesian3());
        var ray = new Ray(origin, direction);

        var expected = {
                start : 0.0,
                stop : ellipsoid.radii.x + origin.x
        };
        var actual = IntersectionTests.rayEllipsoid(ray, ellipsoid);

        expect(actual).toBeDefined();
        expect(actual.start).toEqual(expected.start);
        expect(actual.stop).toEqual(expected.stop);
    });

    it('rayEllipsoid ray inside pointing out intersection', function() {
        var ellipsoid = Ellipsoid.WGS84;

        var origin = new Cartesian3(20000.0, 0.0, 0.0);
        var direction = Cartesian3.normalize(origin, new Cartesian3());
        var ray = new Ray(origin, direction);

        var expected = {
                start : 0.0,
                stop : ellipsoid.radii.x - origin.x
        };
        var actual = IntersectionTests.rayEllipsoid(ray, ellipsoid);

        expect(actual).toBeDefined();
        expect(actual.start).toEqual(expected.start);
        expect(actual.stop).toEqual(expected.stop);
    });

    it('rayEllipsoid tangent intersections', function() {
        var unitSphere = Ellipsoid.UNIT_SPHERE;

        var ray = new Ray(Cartesian3.UNIT_X, Cartesian3.UNIT_Z);
        var intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).not.toBeDefined();
    });

    it('rayEllipsoid no intersections', function() {
        var unitSphere = Ellipsoid.UNIT_SPHERE;

        var ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 0.0, 1.0));
        var intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 0.0, -1.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).not.toBeDefined();

        ray = new Ray(new Cartesian3(2.0, 0.0, 0.0), new Cartesian3(0.0, -1.0, 0.0));
        intersections = IntersectionTests.rayEllipsoid(ray, unitSphere);
        expect(intersections).not.toBeDefined();
    });

    it('grazingAltitudeLocation throws without ray', function() {
        expect(function() {
            IntersectionTests.grazingAltitudeLocation();
        }).toThrowDeveloperError();
    });

    it('grazingAltitudeLocation throws without ellipsoid', function() {
        expect(function() {
            IntersectionTests.grazingAltitudeLocation(new Ray());
        }).toThrowDeveloperError();
    });

    it('grazingAltitudeLocation is origin of ray', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;
        var ray = new Ray(new Cartesian3(3.0, 0.0, 0.0), Cartesian3.UNIT_X);
        expect(IntersectionTests.grazingAltitudeLocation(ray, ellipsoid)).toEqual(ray.origin);
    });

    it('grazingAltitudeLocation outside ellipsoid', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;
        var ray = new Ray(new Cartesian3(-2.0, -2.0, 0.0), Cartesian3.UNIT_X);
        var expected = new Cartesian3(0.0, -2.0, 0.0);
        var actual = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid);
        expect(actual).toEqualEpsilon(expected, CesiumMath.EPSILON15);

        ray = new Ray(new Cartesian3(0.0, 2.0, 2.0), Cartesian3.negate(Cartesian3.UNIT_Y, new Cartesian3()));
        expected = new Cartesian3(0.0, 0.0, 2.0);
        actual = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid);
        expect(actual).toEqualEpsilon(expected, CesiumMath.EPSILON15);
    });

    it('grazingAltitudeLocation outside ellipsoid 2', function() {
        var ellipsoid = Ellipsoid.WGS84;
        var origin = new Cartesian3(6502435.411150063, -6350860.759819263, -7230794.954832983);
        var direction = new Cartesian3(-0.6053473557455881, 0.002372596412575323, 0.7959578818493397);
        var ray = new Ray(origin, direction);
        var expected = new Cartesian3(628106.8386515155, -6327836.936616249, 493230.07552381355);
        var actual = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid);
        expect(actual).toEqualEpsilon(expected, CesiumMath.EPSILON8);
    });

    it('grazingAltitudeLocation outside ellipsoid 3', function() {
        var ellipsoid = Ellipsoid.WGS84;
        var origin = new Cartesian3(-6546204.940468501, -10625195.62660887, -6933745.82875373);
        var direction = new Cartesian3(0.5130076305689283, 0.38589525779680295, 0.766751603185799);
        var ray = new Ray(origin, direction);
        var expected = new Cartesian3(-125.9063174739769, -5701095.640722358, 2850156.57342018);
        var actual = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid);
        expect(actual).toEqualEpsilon(expected, CesiumMath.EPSILON10);
    });

    it('grazingAltitudeLocation inside ellipsoid', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;
        var ray = new Ray(new Cartesian3(0.5, 0.0, 0.0), Cartesian3.UNIT_Z);
        var actual = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid);
        expect(actual).toEqual(ray.origin);
    });

    it('grazingAltitudeLocation is undefined', function() {
        var ellipsoid = Ellipsoid.UNIT_SPHERE;
        var ray = new Ray(Cartesian3.ZERO, Cartesian3.UNIT_Z);
        expect(IntersectionTests.grazingAltitudeLocation(ray, ellipsoid)).not.toBeDefined();
    });

    it('lineSegmentPlane intersects', function() {
        var normal = Cartesian3.clone(Cartesian3.UNIT_Y);
        var point = new Cartesian3(0.0, 2.0, 0.0);
        var plane = Plane.fromPointNormal(point, normal);

        var endPoint0 = new Cartesian3(1.0, 1.0, 0.0);
        var endPoint1 = new Cartesian3(1.0, 3.0, 0.0);

        var intersectionPoint = IntersectionTests.lineSegmentPlane(endPoint0, endPoint1, plane);

        expect(intersectionPoint).toEqual(new Cartesian3(1.0, 2.0, 0.0));
    });

    it('lineSegmentPlane misses (entire segment behind plane)', function() {
        var plane = new Plane(Cartesian3.UNIT_X, 0.0);

        var endPoint0 = new Cartesian3(-2.0, 0.0, 0.0);
        var endPoint1 = new Cartesian3(-5.0, 0.0, 0.0);

        var intersectionPoint = IntersectionTests.lineSegmentPlane(endPoint0, endPoint1, plane);

        expect(intersectionPoint).not.toBeDefined();
    });

    it('lineSegmentPlane misses (entire segment in front of plane)', function() {
        var plane = new Plane(Cartesian3.UNIT_X, 0.0);

        var endPoint0 = new Cartesian3(5.0, 0.0, 0.0);
        var endPoint1 = new Cartesian3(2.0, 0.0, 0.0);

        var intersectionPoint = IntersectionTests.lineSegmentPlane(endPoint0, endPoint1, plane);

        expect(intersectionPoint).not.toBeDefined();
    });

    it('lineSegmentPlane misses (parallel)', function() {
        var plane = new Plane(Cartesian3.UNIT_X, 0.0);

        var endPoint0 = new Cartesian3(0.0, -1.0, 0.0);
        var endPoint1 = new Cartesian3(0.0, 1.0, 0.0);

        var intersectionPoint = IntersectionTests.lineSegmentPlane(endPoint0, endPoint1, plane);

        expect(intersectionPoint).not.toBeDefined();
    });

    it('lineSegmentPlane throws without endPoint0', function() {
        expect(function() {
            IntersectionTests.lineSegmentPlane();
        }).toThrowDeveloperError();
    });

    it('lineSegmentPlane throws without endPoint1', function() {
        expect(function() {
            IntersectionTests.lineSegmentPlane(new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('lineSegmentPlane throws without plane', function() {
        expect(function() {
            IntersectionTests.lineSegmentPlane(new Cartesian3(), new Cartesian3());
        }).toThrowDeveloperError();
    });

    it('triangle is front of a plane', function() {
        var plane = new Plane(Cartesian3.UNIT_Z, 0.0);
        var p0 = new Cartesian3(0.0, 0.0, 2.0);
        var p1 = new Cartesian3(0.0, 1.0, 2.0);
        var p2 = new Cartesian3(1.0, 0.0, 2.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).not.toBeDefined();
     });

    it('triangle is behind a plane', function() {
        var plane = new Plane(Cartesian3.negate(Cartesian3.UNIT_Z, new Cartesian3()), 0.0);
        var p0 = new Cartesian3(0.0, 0.0, 2.0);
        var p1 = new Cartesian3(0.0, 1.0, 2.0);
        var p2 = new Cartesian3(1.0, 0.0, 2.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).not.toBeDefined();
     });

    it('triangle intersects plane with p0 behind', function() {
        var plane = new Plane(Cartesian3.UNIT_Z, -1.0);
        var p0 = new Cartesian3(0.0, 0.0, 0.0);
        var p1 = new Cartesian3(0.0, 1.0, 2.0);
        var p2 = new Cartesian3(0.0, -1.0, 2.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(3 + 6);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p0)).toEqual(true);
    });

    it('triangle intersects plane with p1 behind', function() {
        var plane = new Plane(Cartesian3.UNIT_Z, -1.0);
        var p0 = new Cartesian3(0.0, -1.0, 2.0);
        var p1 = new Cartesian3(0.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 1.0, 2.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(3 + 6);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p1)).toEqual(true);
    });

    it('triangle intersects plane with p2 behind', function() {
        var plane = new Plane(Cartesian3.UNIT_Z, -1.0);
        var p0 = new Cartesian3(0.0, 1.0, 2.0);
        var p1 = new Cartesian3(0.0, -1.0, 2.0);
        var p2 = new Cartesian3(0.0, 0.0, 0.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(3 + 6);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p2)).toEqual(true);
    });

    it('triangle intersects plane with p0 in front', function() {
        var plane = new Plane(Cartesian3.UNIT_Y, -1.0);
        var p0 = new Cartesian3(0.0, 2.0, 0.0);
        var p1 = new Cartesian3(1.0, 0.0, 0.0);
        var p2 = new Cartesian3(-1.0, 0.0, 0.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(6 + 3);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p1)).toEqual(true);  // p0 is in front
        expect(Cartesian3.equals(triangles.positions[triangles.indices[1]], p2)).toEqual(true);
    });

    it('triangle intersects plane with p1 in front', function() {
        var plane = new Plane(Cartesian3.UNIT_Y, -1.0);
        var p0 = new Cartesian3(-1.0, 0.0, 0.0);
        var p1 = new Cartesian3(0.0, 2.0, 0.0);
        var p2 = new Cartesian3(1.0, 0.0, 0.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(6 + 3);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p2)).toEqual(true);  // p1 is in front
        expect(Cartesian3.equals(triangles.positions[triangles.indices[1]], p0)).toEqual(true);
    });

    it('triangle intersects plane with p2 in front', function() {
        var plane = new Plane(Cartesian3.UNIT_Y, -1.0);
        var p0 = new Cartesian3(1.0, 0.0, 0.0);
        var p1 = new Cartesian3(-1.0, 0.0, 0.0);
        var p2 = new Cartesian3(0.0, 2.0, 0.0);

        var triangles = IntersectionTests.trianglePlaneIntersection(p0, p1, p2, plane);
        expect(triangles).toBeDefined();
        expect(triangles.indices.length).toEqual(6 + 3);
        expect(Cartesian3.equals(triangles.positions[triangles.indices[0]], p0), true);  // p2 is in front
        expect(Cartesian3.equals(triangles.positions[triangles.indices[1]], p1)).toEqual(true);
    });

    it('trianglePlaneIntersection throws without p0', function() {
        expect(function() {
            return IntersectionTests.trianglePlaneIntersection();
        }).toThrowDeveloperError();
    });

    it('trianglePlaneIntersection throws without p1', function() {
        var p = Cartesian3.UNIT_X;

        expect(function() {
            return IntersectionTests.trianglePlaneIntersection(p);
        }).toThrowDeveloperError();
    });

    it('trianglePlaneIntersection throws without p2', function() {
        var p = Cartesian3.UNIT_X;

        expect(function() {
            return IntersectionTests.trianglePlaneIntersection(p, p);
        }).toThrowDeveloperError();
    });

    it('trianglePlaneIntersection throws without plane', function() {
        var p = Cartesian3.UNIT_X;

        expect(function() {
            return IntersectionTests.trianglePlaneIntersection(p, p, p);
        }).toThrowDeveloperError();
    });
});
});
