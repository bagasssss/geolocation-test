import React from 'react';
import {Alert, Button, StyleSheet, Text, View, Platform} from 'react-native';
import {Constants, Location, Permissions} from 'expo';

export default class App extends React.Component {

    watchLocation = null;

    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMessage: null,
            activeStatus: 'active',
            buttonLabel: 'Press to START'
        };
    }

    onPressButton= () => {
        this.state.activeStatus === 'active' ? this.setState({activeStatus: 'passive', buttonLabel: 'Press to START'}) : this.setState({activeStatus: 'active',  buttonLabel: 'Press to STOP'});
        this.sendChangeStatus();
        if(this.state.activeStatus === 'active'){
            this.startWatchingLocation();
        }else{
            this.watchLocation.remove();
        }
    };

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this.askPermission();
        }
    };

    askPermission = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
    };

    startWatchingLocation = async () => {
        let that = this;
        this.watchLocation = await Location.watchPositionAsync(
            {timeInterval:1000},
            (location) => {
                that.setState({ location: location });
                that.updateLocation();
            }
        );
    };

    sendChangeStatus() {
        return fetch('https://mywebsite.com/changeState/', {
            method: 'POST',
            body: JSON.stringify({
                status: this.state.activeStatus,
                location: this.state.location,
            })

        })
            .then(response => response.json())
            .catch((error) => {
                console.error(error);
            });
    };

    updateLocation() {
        return fetch('https://mywebsite.com/newLocation/', {
            method: 'POST',
            body: JSON.stringify({
                location: this.state.location,
            })

        })
            .then(response => response.json())
            .catch((error) => {
                console.error(error);
            });
    };

    render() {

        return (
            <View style={styles.container}>
                <Text>Status - {this.state.activeStatus}</Text>
                <Button
                    onPress={this.onPressButton}
                    title={this.state.buttonLabel}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

});
