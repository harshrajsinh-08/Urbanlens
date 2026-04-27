from sklearn.preprocessing import LabelEncoder
import numpy as np

exclude_cols = ['price', 'log_price']

X = df.drop(columns=exclude_cols)

categorical_cols = X.select_dtypes(include=['object']).columns

for col in categorical_cols:
    if X[col].nunique() < 20:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
    else:
        X = X.drop(columns=[col])

X = X.fillna(X.median())

y_log = df['log_price']
y_original = df['price']