import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  
  mainContainer: {
    flex: 1,
    backgroundColor: '#000'
  },

  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    marginTop: 50,
  },

  detailsContainer: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },

  sliderContainer: {
    flex: 0.45,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 40
  },

  albumImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    borderRadius: 40,
  },

  progressBar: {
    height: 20,
    width: '70%'
  },

  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d80073'
  },
  artist: {
    fontSize: 14,
    color: '#d80073'
  },

  btnSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 250
  },

  playButton: {
    alignItems: "center",
  },

  prevButton: {
    alignItems: 'flex-start',
  },

  nextButton: {
    alignItems: 'flex-end',
   }
});

export default styles;