import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

// how make timer create user
const MAX_TIMERS = 5;

export default function App() {
  const [timers, setTimers] = useState([]);
  const [activeTimer,setActiveTimer] =useState()

  const addTimer = (initialTime) => {
    // chech limited if timer left greater then 5 after show alert
    if (timers.length >= MAX_TIMERS) {
      Alert.alert('Limit Reached', 'You can only have up to 5 timers');
      return;
    }
    // Make Array of object 
    setTimers([
      ...timers,
      {
        id: timers.length + 1,            // Unique ID for each timer
        timeLeft: initialTime * 1000,     // Initial time in milliseconds
        isRunning: false,                 // Start, Paused
        initialTime: initialTime * 1000,  // Original time for reset
      },
    ]);
  };

   //get id of timer and startTimer
  const startTimer = (id) => {
    setActiveTimer(id)
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
       // then isRunning true and start timer means timerLeft
        timer.id === id ? { ...timer, isRunning: true } : timer
      )
    );
  };

  //get id of timer and pauseTimer
  const pauseTimer = (id) => {
    setActiveTimer('')
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        // then isRunning false and stop timer
        timer.id === id ? { ...timer, isRunning: false } : timer
      )
    );
  };

  //get id of timer and resetTimer
  const resetTimer = (id) => {
    setActiveTimer('')
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        // and check id
        timer.id === id
        // then isRunning false and set value of timeLeft  as initialTime
          ? { ...timer, isRunning: false, timeLeft: timer.initialTime }
          //otherwise
          : timer
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          // isRunning === true and timeleft greater then 0 
          if (timer.isRunning && timer.timeLeft > 0) {
         // Decrease timerleft 
            return { ...timer, timeLeft: timer.timeLeft - 1000 };
        // isRunning === true and timeleft  0 or less then 0 
          } else if (timer.isRunning && timer.timeLeft <= 0) {
          // isRunning is false
            timer.isRunning = false;
           // after show alert
           setActiveTimer('')
            Alert.alert('Timer Complete', `Timer ${timer.id} has finished`);
          // return timerleft
            return { ...timer, timeLeft: 0 };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log('timer',timers)

  return (
    <View style={styles.container}>
<StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "#070707" />
    <Text style={styles.title}>Multi Timer App</Text>
    {/* user set limit of timer and create timer */}
    <TextInput
      style={styles.input}
      placeholder="Enter time in seconds"
      placeholderTextColor={"#fff"}
      keyboardType="numeric"
      onSubmitEditing={(event) => {
        const time = parseInt(event.nativeEvent.text);
        if (!isNaN(time) && time > 0) {
          addTimer(time);
        } else {
          Alert.alert('Invalid Input', 'Please enter a valid number');
        }
      }}
    />

{/*  All Timer  show  */}
    <FlatList
      data={timers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={[styles.timerContainer,{borderColor:activeTimer === item.id ? "#873dfb":"#B45DD6"}]}>
          <Text style={styles.timerText}>Timer {item.id}</Text>
          <Text style={styles.timerText}>
            {Math.floor(item.timeLeft / 1000)} seconds left
          </Text>
          <View style={styles.buttonRow}>
            {item.isRunning ? (
              <TouchableOpacity  onPress={() => pauseTimer(item.id)} style={{width:"48%",height:40,backgroundColor:"#873dfb",borderTopLeftRadius:30,borderBottomLeftRadius:30,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <Text style={{color:"#fff",fontSize:16,marginTop:3,fontFamily:"Poppins-Medium"}}>Paused</Text>
             </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => startTimer(item.id)} style={{width:"48%",height:40,backgroundColor:"#b45dd6",borderTopLeftRadius:30,borderBottomLeftRadius:30,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <Text style={{color:"#fff",fontSize:16,marginTop:3,fontFamily:"Poppins-Medium"}}>Start</Text>
             </TouchableOpacity>
            )}
            

             <TouchableOpacity  onPress={() => resetTimer(item.id)} style={{width:"48%",height:40,backgroundColor:"#b45dd6",borderTopRightRadius:30,borderBottomRightRadius:30,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
             <Text style={{color:"#fff",fontSize:16,fontFamily:"Poppins-Medium",}}>Reset</Text>
              </TouchableOpacity>

            {/* <Button
              title="Reset"
              onPress={() => resetTimer(item.id)}
              color="red"
            /> */}
          </View>
        </View>
      )}
    />
  </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor:"#070707"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:"#fff",
    fontFamily:"Poppins-SemiBold"

  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderColor:"#fff",
    borderRadius:10,
    color:"#fff",
    fontFamily:"Poppins-SemiBold"
    
  
  },
  timerContainer: {
    marginVertical: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor:"#000",
    
    
    
  },


  timerText: {
    fontSize: 16,
    marginBottom: 10,
    color:"#fff",
    fontFamily:"Poppins-Medium"
  },
  buttonRow: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});