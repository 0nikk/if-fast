import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FastingSession, useFasting } from '../../context/FastingContext';
import { FASTING_PLANS } from '../../utils/plans';
import { formatTime } from '../../utils/timer';

const DEFAULT_PLAN = FASTING_PLANS[2];

export default function Index() {
  const { addSession } = useFasting();
  const [targetSeconds, setTargetSeconds] = useState(DEFAULT_PLAN.seconds);
  const [time, setTime] = useState(DEFAULT_PLAN.seconds);
  const [isActive, setIsActive] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && endAt) {
      interval = setInterval(() => {
        const nextTime = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        setTime(nextTime);
      }, 250);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, endAt]);

  useEffect(() => {
    if (isActive && time === 0 && startedAt) {
      const completedSession: FastingSession = {
        id: `session-${startedAt}`,
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date().toISOString(),
        targetSeconds,
        actualSeconds: targetSeconds,
        status: 'completed',
      };

      addSession(completedSession);
      setIsActive(false);
      setStartedAt(null);
      setEndAt(null);
    }
  }, [addSession, isActive, startedAt, targetSeconds, time]);

  const progress = useMemo(() => {
    const consumed = targetSeconds - time;
    return Math.max(0, Math.min(1, consumed / targetSeconds));
  }, [targetSeconds, time]);

  const handlePlanSelect = (seconds: number) => {
    if (isActive || startedAt) {
      return;
    }

    setTargetSeconds(seconds);
    setTime(seconds);
  };

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      setEndAt(null);
      return;
    }

    if (!startedAt) {
      setStartedAt(Date.now());
    }

    setEndAt(Date.now() + time * 1000);
    setIsActive(true);
  };

  const handleReset = () => {
    if (startedAt && time < targetSeconds) {
      addSession({
        id: `session-${startedAt}-early`,
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date().toISOString(),
        targetSeconds,
        actualSeconds: targetSeconds - time,
        status: 'stopped_early',
      });
    }

    setIsActive(false);
    setStartedAt(null);
    setEndAt(null);
    setTime(targetSeconds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fasting timer</Text>
      <Text style={styles.text}>{formatTime(time)}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.planContainer}
        showsHorizontalScrollIndicator={false}>
        {FASTING_PLANS.map((plan) => {
          const isSelected = targetSeconds === plan.seconds;
          return (
            <Pressable
              key={plan.label}
              onPress={() => handlePlanSelect(plan.seconds)}
              style={[styles.planChip, isSelected && styles.planChipSelected]}>
              <Text style={[styles.planChipText, isSelected && styles.planChipTextSelected]}>
                {plan.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable onPress={handleStartStop}>
          <Text style={styles.button}>{isActive ? 'Pause' : 'Start'}</Text>
        </Pressable>
        <Pressable onPress={handleReset}>
          <Text style={styles.button}>Reset</Text>
        </Pressable>
      </View>

      <Text style={styles.helperText}>
        Select a plan, then complete your fast to save it in Stats.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 18,
  },
  label: {
    color: '#9ba1a6',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    color: '#fff',
    fontSize: 58,
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#404652',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffd33d',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 24,
  },
  planContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  planChip: {
    borderWidth: 1,
    borderColor: '#545b66',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  planChipSelected: {
    backgroundColor: '#ffd33d',
    borderColor: '#ffd33d',
  },
  planChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  planChipTextSelected: {
    color: '#25292e',
  },
  helperText: {
    color: '#9ba1a6',
    textAlign: 'center',
  },
});
