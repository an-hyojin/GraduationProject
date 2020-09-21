song_data = pd.read_csv("data1")
level_data = pd.read_csv("data2")

data = pd.merge(song_data, level_data, on = '')
