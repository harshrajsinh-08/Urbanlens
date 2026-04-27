import numpy as np
from shapely.geometry import Point
import geopandas as gpd
from scipy.spatial import cKDTree
import osmnx as ox

lat_col = [col for col in df.columns if 'latitude' in col.lower()][0]
lon_col = [col for col in df.columns if 'longitude' in col.lower()][0]

df = df.dropna(subset=[lat_col, lon_col])

geometry = [Point(xy) for xy in zip(df[lon_col], df[lat_col])]
gdf = gpd.GeoDataFrame(df, geometry=geometry, crs="EPSG:4326")

gdf = gdf.to_crs("EPSG:27700")
lsoa_geo = lsoa_geo.to_crs("EPSG:27700")

gdf_with_lsoa = gpd.sjoin(gdf, lsoa_geo, how='left', predicate='within')

if lsoa_csv is not None:
    lsoa_id_cols = [col for col in lsoa_geo.columns if 'code' in col.lower() or 'id' in col.lower()]
    if lsoa_id_cols:
        lsoa_id = lsoa_id_cols[0]
        gdf_with_lsoa = gdf_with_lsoa.merge(lsoa_csv, on=lsoa_id, how='left')

df = gdf_with_lsoa.drop(columns='geometry')


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
    return 2 * R * np.arctan2(np.sqrt(a), np.sqrt(1-a))


key_locations = {
    'city_center': (51.5074, -0.1278),
    'heathrow': (51.4700, -0.4543),
    'canary_wharf': (51.5054, -0.0235),
    'kings_cross': (51.5309, -0.1239),
    'oxford_street': (51.5155, -0.1419)
}

for name, (lat, lon) in key_locations.items():
    df[f'spatial_{name}_km'] = haversine_distance(df[lat_col], df[lon_col], lat, lon)


pois = ox.features_from_place(
    "Greater London, UK",
    tags={
        "amenity": ["restaurant", "cafe", "pub", "bar"],
        "shop": ["supermarket", "convenience"],
        "public_transport": "station"
    }
)

pois = pois[pois.geometry.notna()].copy()
pois = pois.to_crs("EPSG:4326")

pois['centroid'] = pois.geometry.centroid
poi_coords = np.column_stack([pois['centroid'].x.values, pois['centroid'].y.values])

tree = cKDTree(poi_coords)
airbnb_coords = np.column_stack([df[lon_col].values, df[lat_col].values])

distances, indices = tree.query(airbnb_coords, k=10)

distances_km = np.zeros_like(distances)

for i in range(len(airbnb_coords)):
    for j in range(10):
        distances_km[i, j] = haversine_distance(
            airbnb_coords[i, 1], airbnb_coords[i, 0],
            poi_coords[indices[i, j], 1], poi_coords[indices[i, j], 0]
        )

df['spatial_nearest_amenity_km'] = distances_km[:, 0]
df['spatial_avg_5_amenities_km'] = distances_km[:, :5].mean(axis=1)
df['spatial_amenities_500m'] = (distances_km < 0.5).sum(axis=1)
df['spatial_amenity_density'] = df['spatial_amenities_500m'] / (df['spatial_nearest_amenity_km'] + 0.01)