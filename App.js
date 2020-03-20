import React, { Component } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, RefreshControl, View, ActivityIndicator, Image } from 'react-native';
import { format } from "date-fns";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { refreshing: false, data: [], queriedAt: 'N/A' };
  }

  onRefresh = async (showLoading) => {
    if (showLoading == true) {
      // Update refreshing state
      this.setState((state) => ({refreshing: true, data: state.data, updatedAt: state.updatedAt, queriedAt: state.queriedAt}))
    }

    // Fetch new data
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      //let responseJson = mockApiData;
      this.setState({
        refreshing: false,
        data: responseJson.sort((x, y) => (y.cases - x.cases)),
        queriedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss")
      })
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    this.onRefresh(false);
  }

  renderToolbar() {
    return(
      <SafeAreaView style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Covid19 Statistics</Text>
          <Image style={styles.toolbarButton} source={require('./ic_search.png')}/>
      </SafeAreaView>
    );
  }

  renderHeader() {
    return(
      <SafeAreaView style={styles.header}>
          <Text style={styles.headerItem}>Country</Text>
          <Text style={styles.headerItem}>Total Cases</Text>
          <Text style={styles.headerItem}>Today Cases</Text>
          <Text style={styles.headerItem}>Total Deaths</Text>
          <Text style={styles.headerItem}>Today Deaths</Text>
          <Text style={styles.headerItem}>Total Recovered</Text>
      </SafeAreaView>
    );
  }

  renderItem(item) {
    return(
      <SafeAreaView style={styles.listItem}>
          <Text style={styles.number}>{item.country}</Text>
          <Text style={styles.number}>{numberWithCommas(item.cases)}</Text>
          <Text style={styles.number}>+{numberWithCommas(item.todayCases)}</Text>
          <Text style={styles.death}>{numberWithCommas(item.deaths)}</Text>
          <Text style={styles.death}>+{numberWithCommas(item.todayDeaths)}</Text>
          <Text style={styles.number}>{numberWithCommas(item.recovered)}</Text>
        </SafeAreaView>
    );
  }

  renderSeparator() {
    return(
      <View style={styles.separator}/>
    );
  }

  renderRefreshControl() {
    return(
      <RefreshControl
        refreshing={this.state.refreshing} 
        onRefresh={() => { this.onRefresh(true) }} 
      />
    );
  }

  render() {
    if (!this.state.data.length) {
      return(
        <SafeAreaView style={styles.container}>
          { this.renderToolbar() }
          <ActivityIndicator style={{flex: 1, alignSelf: 'center'}}/>
        </SafeAreaView>
      );
    }

    return(
      <SafeAreaView style={styles.container}>
        { this.renderToolbar() }

        <SafeAreaView style={styles.info}>
          <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.infoText}>Data queried at</Text>
            <Text style={styles.infoText}>{this.state.queriedAt}</Text>
          </SafeAreaView>
        </SafeAreaView>

        {this.renderHeader()}

        <FlatList
          data={this.state.data}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={({country}, index) => country}
          refreshControl={this.renderRefreshControl()}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#1e80f0',
    height: 55,
    shadowColor: 'black',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  toolbarTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginStart: 10
  },
  toolbarButton: {
    width: 33, 
    height: 33,
    alignSelf: 'center',
    marginEnd: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  info: {
      height: 30,
      backgroundColor: '#1396f0',
      justifyContent: 'center',
      paddingStart: 10,
      paddingEnd: 10
  },
  infoText: {
    color: 'white',
    fontStyle: 'italic'
  },
  header: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#36b6ff'
  },
  headerItem: {
    flex: 1,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    paddingStart: 10,
    paddingTop: 10,
    paddingEnd: 10,
    paddingBottom: 10
  },
  list: {},
  listItem: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    paddingStart: 3,
    paddingEnd: 3,
    backgroundColor: 'white'
  },
  separator: {
    height: 4,
    backgroundColor: '#fafafa'
  },
  number: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center'
  },
  death: {
    flex: 1,
    color: 'red',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center'
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const url = 'https://coronavirus-19-api.herokuapp.com/countries';