// Elevator Controller handling 9-step transit sequence & floor synchronization
import { useStore } from '../../store/useStore';
import { sounds } from '../../services/soundEffects';

export const ELEVATOR_FLOOR_Y = {
  0: 0,
  1: 8,
  2: 16,
  3: 24
};

export const ElevatorController = {
  // Execute full 9-step physical transit to destination floor
  startFloorTransit: (destinationFloor) => {
    const store = useStore.getState();
    const currentFloor = store.selectedFloor;

    if (destinationFloor === currentFloor && store.currentView === 'SHOWROOM') {
      return;
    }

    // Step 1 & 2: Set target floor & move camera towards elevator
    sounds.playClick();
    useStore.setState({
      targetFloor: destinationFloor,
      currentView: 'TRANSITION_ELEVATOR',
      activeHotspot: null,
      elevatorDoorOpen: false,
      elevatorMoving: false
    });

    // Step 3: Elevator doors slide open at current floor
    setTimeout(() => {
      sounds.playDoorOpen();
      useStore.setState({ elevatorDoorOpen: true });
    }, 800);

    // Step 4 & 5: Camera enters elevator cab & doors close smoothly
    setTimeout(() => {
      useStore.setState({
        currentView: 'IN_ELEVATOR',
        elevatorDoorOpen: false,
        elevatorMoving: true
      });
    }, 2000);

    // Step 6 & 7: Physical vertical transit through atrium & updating digital matrix
    setTimeout(() => {
      const displayMap = { 0: 'G', 1: '1F', 2: '2F', 3: '3F' };
      useStore.setState({
        elevatorFloorDisplay: displayMap[destinationFloor] || `${destinationFloor}F`
      });
    }, 3600);

    // Step 8: Destination arrival chime & doors open at destination floor
    setTimeout(() => {
      sounds.playElevatorDing();
      useStore.setState({
        elevatorMoving: false,
        elevatorDoorOpen: true,
        selectedFloor: destinationFloor
      });
    }, 5000);

    // Step 9: Camera smoothly steps out into the destination department showroom
    setTimeout(() => {
      useStore.setState({
        currentView: destinationFloor === 0 ? 'GROUND_LOBBY' : 'SHOWROOM',
        elevatorDoorOpen: false
      });
    }, 6400);
  }
};
