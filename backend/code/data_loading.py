import pandas as pd
import geopandas as gpd

listings = pd.read_csv('./content/listings.csv')
lsoa_geo = gpd.read_file('./content/LSOA.geojson')

try:
    lsoa_csv = pd.read_csv('./content/LSOA.csv')
except:
    lsoa_csv = None