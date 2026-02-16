import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFasting } from '../../context/FastingContext';
import { getSummary } from '../../utils/stats';
import { formatTime } from '../../utils/timer';

export default function Stats() {
  const { sessions, clearSessions } = useFasting();
  const summary = getSummary(sessions);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your fasting stats</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{summary.completedCount}</Text>
          <Text style={styles.cardLabel}>Completed</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{Math.round(summary.completionRate * 100)}%</Text>
          <Text style={styles.cardLabel}>Completion rate</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{formatTime(summary.averageCompletedSeconds)}</Text>
          <Text style={styles.cardLabel}>Avg completed</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{formatTime(summary.longestCompletedSeconds)}</Text>
          <Text style={styles.cardLabel}>Longest fast</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent sessions</Text>
      {sessions.length === 0 ? (
        <Text style={styles.emptyText}>No sessions yet. Complete a fast on the Timer tab.</Text>
      ) : (
        sessions.slice(0, 8).map((session) => (
          <View key={session.id} style={styles.sessionRow}>
            <View>
              <Text style={styles.sessionStatus}>
                {session.status === 'completed' ? 'Completed' : 'Stopped early'}
              </Text>
              <Text style={styles.sessionMeta}>
                {new Date(session.endedAt).toLocaleDateString()} · Goal {formatTime(session.targetSeconds)}
              </Text>
            </View>
            <Text style={styles.sessionDuration}>{formatTime(session.actualSeconds)}</Text>
          </View>
        ))
      )}

      {sessions.length > 0 && (
        <Pressable onPress={clearSessions} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear session history</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#343b46',
    borderRadius: 14,
    padding: 14,
  },
  cardValue: {
    color: '#ffd33d',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardLabel: {
    color: '#d6d8dd',
    fontSize: 13,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyText: {
    color: '#9ba1a6',
    fontSize: 15,
  },
  sessionRow: {
    backgroundColor: '#343b46',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionStatus: {
    color: '#fff',
    fontWeight: '700',
  },
  sessionMeta: {
    color: '#a9b0ba',
    marginTop: 2,
  },
  sessionDuration: {
    color: '#ffd33d',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  clearText: {
    color: '#ff8f8f',
    textDecorationLine: 'underline',
  },
});
