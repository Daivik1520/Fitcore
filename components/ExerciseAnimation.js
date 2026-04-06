import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const AnimatedG = Animated.createAnimatedComponent
  ? Animated.createAnimatedComponent(G)
  : G;

const SIZE = 64;
const CX = SIZE / 2;
const CY = SIZE / 2;
const STROKE = COLORS.primaryLight;

// Simple stick figure keyframes per exercise type
const POSES = {
  push: [
    // Push-up down
    { head: [32, 14], lh: [16, 28], rh: [48, 28], lf: [20, 52], rf: [44, 52], body: [32, 24] },
    // Push-up up
    { head: [32, 10], lh: [14, 22], rh: [50, 22], lf: [20, 52], rf: [44, 52], body: [32, 20] },
  ],
  pull: [
    { head: [32, 18], lh: [18, 10], rh: [46, 10], lf: [24, 52], rf: [40, 52], body: [32, 30] },
    { head: [32, 12], lh: [20, 8], rh: [44, 8], lf: [24, 52], rf: [40, 52], body: [32, 24] },
  ],
  legs: [
    // Squat down
    { head: [32, 12], lh: [20, 28], rh: [44, 28], lf: [22, 54], rf: [42, 54], body: [32, 26] },
    // Squat up
    { head: [32, 8], lh: [18, 20], rh: [46, 20], lf: [26, 54], rf: [38, 54], body: [32, 20] },
  ],
  core: [
    // Plank
    { head: [14, 24], lh: [10, 36], rh: [10, 36], lf: [52, 36], rf: [52, 36], body: [32, 32] },
    // Crunch
    { head: [18, 20], lh: [12, 30], rh: [12, 30], lf: [50, 38], rf: [50, 38], body: [30, 30] },
  ],
  cardio: [
    // Jump up
    { head: [32, 6], lh: [16, 14], rh: [48, 14], lf: [24, 46], rf: [40, 46], body: [32, 18] },
    // Jump down
    { head: [32, 14], lh: [18, 24], rh: [46, 24], lf: [24, 54], rf: [40, 54], body: [32, 28] },
  ],
  flexibility: [
    // Stretch reach
    { head: [32, 10], lh: [12, 16], rh: [52, 16], lf: [24, 54], rf: [40, 54], body: [32, 24] },
    // Stretch fold
    { head: [32, 30], lh: [18, 36], rh: [46, 36], lf: [24, 54], rf: [40, 54], body: [32, 36] },
  ],
};

export default function ExerciseAnimation({ muscleGroup = 'push', size = 64, isActive = false }) {
  const anim = useRef(new Animated.Value(0)).current;
  const poses = POSES[muscleGroup] || POSES.push;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: false }),
          Animated.timing(anim, { toValue: 0, duration: 600, useNativeDriver: false }),
        ])
      ).start();
    } else {
      anim.setValue(0);
    }
  }, [isActive]);

  // Interpolate between pose 0 and pose 1
  const lerp = (a, b) => {
    if (!isActive) return a;
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [a, b],
    });
  };

  const p0 = poses[0];
  const p1 = poses[1];
  const scale = size / SIZE;

  // For non-animated, just render static
  const p = isActive ? null : p0;

  if (!isActive) {
    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Head */}
          <Circle cx={p.head[0]} cy={p.head[1]} r={5} fill="none" stroke={STROKE} strokeWidth={1.5} />
          {/* Body */}
          <Line x1={p.head[0]} y1={p.head[1] + 5} x2={p.body[0]} y2={p.body[1] + 10} stroke={STROKE} strokeWidth={1.5} />
          {/* Left arm */}
          <Line x1={p.head[0]} y1={p.head[1] + 8} x2={p.lh[0]} y2={p.lh[1]} stroke={STROKE} strokeWidth={1.5} />
          {/* Right arm */}
          <Line x1={p.head[0]} y1={p.head[1] + 8} x2={p.rh[0]} y2={p.rh[1]} stroke={STROKE} strokeWidth={1.5} />
          {/* Left leg */}
          <Line x1={p.body[0]} y1={p.body[1] + 10} x2={p.lf[0]} y2={p.lf[1]} stroke={STROKE} strokeWidth={1.5} />
          {/* Right leg */}
          <Line x1={p.body[0]} y1={p.body[1] + 10} x2={p.rf[0]} y2={p.rf[1]} stroke={STROKE} strokeWidth={1.5} />
        </Svg>
      </View>
    );
  }

  // For animated, use Animated values
  return <AnimatedStickFigure anim={anim} p0={p0} p1={p1} size={size} />;
}

function AnimatedStickFigure({ anim, p0, p1, size }) {
  const [frame, setFrame] = React.useState(p0);

  useEffect(() => {
    const id = anim.addListener(({ value }) => {
      const interp = (a, b) => a + (b - a) * value;
      setFrame({
        head: [interp(p0.head[0], p1.head[0]), interp(p0.head[1], p1.head[1])],
        lh: [interp(p0.lh[0], p1.lh[0]), interp(p0.lh[1], p1.lh[1])],
        rh: [interp(p0.rh[0], p1.rh[0]), interp(p0.rh[1], p1.rh[1])],
        lf: [interp(p0.lf[0], p1.lf[0]), interp(p0.lf[1], p1.lf[1])],
        rf: [interp(p0.rf[0], p1.rf[0]), interp(p0.rf[1], p1.rf[1])],
        body: [interp(p0.body[0], p1.body[0]), interp(p0.body[1], p1.body[1])],
      });
    });
    return () => anim.removeListener(id);
  }, []);

  const p = frame;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle cx={p.head[0]} cy={p.head[1]} r={5} fill="none" stroke={STROKE} strokeWidth={1.5} />
        <Line x1={p.head[0]} y1={p.head[1] + 5} x2={p.body[0]} y2={p.body[1] + 10} stroke={STROKE} strokeWidth={1.5} />
        <Line x1={p.head[0]} y1={p.head[1] + 8} x2={p.lh[0]} y2={p.lh[1]} stroke={STROKE} strokeWidth={1.5} />
        <Line x1={p.head[0]} y1={p.head[1] + 8} x2={p.rh[0]} y2={p.rh[1]} stroke={STROKE} strokeWidth={1.5} />
        <Line x1={p.body[0]} y1={p.body[1] + 10} x2={p.lf[0]} y2={p.lf[1]} stroke={STROKE} strokeWidth={1.5} />
        <Line x1={p.body[0]} y1={p.body[1] + 10} x2={p.rf[0]} y2={p.rf[1]} stroke={STROKE} strokeWidth={1.5} />
      </Svg>
    </View>
  );
}
