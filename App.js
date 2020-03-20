import React, { Component } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, RefreshControl, View } from 'react-native';
import ToolbarAndroid from '@react-native-community/toolbar-android';
import { format } from "date-fns";

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { refreshing: false, data: [], updatedAt: 'N/A', queriedAt: 'N/A' };
  }

  onRefresh = async () => {
    // Update refreshing state
    this.setState((state) => ({refreshing: true, data: state.data, updatedAt: state.updatedAt, queriedAt: state.queriedAt}))

    // Fetch new data
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      this.setState({
        refreshing: false,
        data: responseJson.Countries.sort((x, y) => (y.TotalConfirmed - x.TotalConfirmed)),
        updatedAt: responseJson.Date.replace("T", " ").split(".")[0],
        queriedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss")
      })
    } catch (error) {
      console.error(error);
    }
  };

  onSearch() {}

  componentDidMount() {
    this.onRefresh();
  }

  renderHeader() {
    return(
      <SafeAreaView style={styles.header}>
          <Text style={styles.headerItem}>Country</Text>
          <Text style={styles.headerItem}>Total Cases</Text>
          <Text style={styles.headerItem}>New Cases</Text>
          <Text style={styles.headerItem}>Total Deaths</Text>
          <Text style={styles.headerItem}>New Deaths</Text>
          <Text style={styles.headerItem}>Total Recovered</Text>
      </SafeAreaView>
    );
  }

  renderItem(item) {
    return(
      <SafeAreaView style={styles.listItem}>
          <Text style={styles.number}>{item.Country}</Text>
          <Text style={styles.number}>{numberWithCommas(item.TotalConfirmed)}</Text>
          <Text style={styles.number}>+{numberWithCommas(item.NewConfirmed)}</Text>
          <Text style={styles.death}>{numberWithCommas(item.TotalDeaths)}</Text>
          <Text style={styles.death}>+{numberWithCommas(item.NewDeaths)}</Text>
          <Text style={styles.number}>{numberWithCommas(item.TotalRecovered)}</Text>
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
      <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <ToolbarAndroid 
          style={styles.toolbar}
          actions={[{title: 'Search', icon: require('./ic_search.png'), show: 'always'}]}
          onActionSelected={this.onSearch}>
            <Text style={styles.toolbarTitle}>Covid Statistics</Text>
        </ToolbarAndroid>

        <SafeAreaView style={styles.info}>
          <Text style={styles.infoText}>Queried at: {this.state.queriedAt}</Text>
          <Text style={styles.infoText}>Updated at: {this.state.updatedAt}</Text>
        </SafeAreaView>

        <FlatList
          data={this.state.data}
          ListHeaderComponent={this.renderHeader()}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={({Country}, index) => Country}
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
    height: 60,
    shadowColor: 'black',
    elevation: 5
  },
  toolbarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  info: {
      backgroundColor: '#1396f0',
      padding: 10
  },
  infoText: {
    color: 'white'
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
    padding: 10
  },
  list: {},
  listItem: {
    flex: 6.5,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
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
    textAlignVertical: 'center'
  },
  death: {
    flex: 1,
    color: 'red',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const url = 'https://api.covid19api.com/summary';