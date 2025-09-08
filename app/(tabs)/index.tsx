import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '../../utils/timer';

const START_TIME = 1200 * 60;

export default function Index() {
  const [time, setTime] = useState(START_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStartStop = () => {
    setIsActive((prevState) => !prevState);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(START_TIME);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleStartStop}>
          <Text style={styles.button}>{isActive ? 'Stop' : 'Start'}</Text>
        </Pressable>
        <Pressable onPress={handleReset}>
          <Text style={styles.button}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 70,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
});
