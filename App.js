
import {StyleSheet, Text, View, Dimensions, Image, FlatList, Animated, Button} from 'react-native';
import {getMovies} from './api';
import Genres from "./Genres";
import Rating from "./Rating";
import {useEffect, useRef, useState} from "react";
import {LinearGradient} from 'expo-linear-gradient'


const {width, height} = Dimensions.get('window')
const SPACING = 10
const ITEM_SIZE = width * 0.72
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2
const BACKDROP_HEIGHT = height * 0.6

const Loading = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
)

const Backdrop = ({movies, scrollX}) => {
    return (
        <View style={{height: BACKDROP_HEIGHT, width, position: 'absolute'}}>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.key + '-backdrop'}
                removeClippedSubviews={false}
                contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
                renderItem={({item, index}) => {
                    if(!item.backdrop) {
                        return null
                    }

                    const translateX = scrollX.interpolate({
                        inputRange: [
                            (index - 2) * ITEM_SIZE,
                            (index - 1) * ITEM_SIZE
                        ],
                        outputRange: [0, width]

                    })
                    return (
                        <Animated.View
                            removeClippedSubviews={false}
                            style={{
                                position: 'absolute',
                                width: translateX,
                                height,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                source={{uri: item.backdrop}}
                                style={{
                                    width,
                                    height: BACKDROP_HEIGHT,
                                    position: 'absolute'
                                }}
                            />
                        </Animated.View>
                    )
                }}
            />
            <LinearGradient
                colors={['transparent', '#fff']}
                style={{
                    width,
                    height: BACKDROP_HEIGHT,
                    position: 'absolute',
                    bottom: 0
            }}
            />
        </View>
    )
}


export default function App() {
  const [movies, setMovies] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false)
  const scrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies([{key: 'left-spacer'},...movies, {key: 'right-spacer'}])
    }

    if (movies.length === 0) {
            fetchData(movies);
    }
  }, [movies]);

    if (movies.length === 0) {
        return <Loading/>
    }


    return (
    <View style={styles.container}>
      <Backdrop movies={movies} scrollX={scrollX}/>
      <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={movies}
          keyExtractor={(item) => item.key}
          horizontal
          contentContainerStyle={{
              alignItems: 'center'
          }}
          snapToInterval={ITEM_SIZE}
          decelerationRate={0}
          bounces={false}
          snapToAlignment='start'
          onScroll={Animated.event(
              [{ nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: false}
          )}
          scrollEventThrottle={16}
          renderItem={({item, index}) => {

              if(!item.poster) {
                  return <View style={{width: SPACER_ITEM_SIZE}}/>
              }
              const inputRange = [
                  (index - 2) * ITEM_SIZE,
                  (index - 1) * ITEM_SIZE,
                  index * ITEM_SIZE,
              ]
              const translateY = scrollX.interpolate({
                  inputRange,
                  outputRange: [100, 50, 100]
              })
              return (
                  <View style={{width: ITEM_SIZE}}>
                      <Animated.View
                          style={{
                              marginHorizontal: SPACING,
                              padding: SPACING * 2,
                              alignItems: 'center',
                              backgroundColor: 'transparent',
                              borderRadius: 34,
                              transform: [{
                                  translateY
                              }]
                          }}
                      >
                          <Image
                              style={styles.posterImage}
                              source={{uri: item.poster}}
                          />
                          <Text
                              style={{fontSize : 24}}
                              numberOfLines={1}
                          >
                              {item.title}
                          </Text>
                          <Text
                              style={{fontSize : 14}}
                              numberOfLines={1}
                          >
                              ({item.original_title}) {item.releaseDate}
                          </Text>
                          <Rating rating={item.rating}/>
                          <Genres genres={item.genres}/>
                          <Text
                              style={{fontSize: 12}}
                              numberOfLines={infoOpen ? 10 : 3}
                          >{item.description}</Text>
                          <View style={{borderWidth: 1, borderRadius: 10, width: 70, marginTop: 15, }}>
                              <Button title='▽' color='black' onPress={() => {setInfoOpen(!infoOpen)}} />
                          </View>

                      </Animated.View>
                  </View>
              )
          }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    posterImage: {
        width: '100%',
        height: ITEM_SIZE * 1.2,
        resizeMode: 'cover',
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
});
