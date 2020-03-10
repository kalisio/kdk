Attributes {
    LatLon_Projection {
        String grid_mapping_name "latitude_longitude";
        Float64 earth_radius 6367470.0;
    }
    lat {
        String units "degrees_north";
    }
    lon {
        String units "degrees_east";
    }
    reftime {
        String units "Hour since 2019-11-26T12:00:00Z";
        String standard_name "forecast_reference_time";
        String long_name "GRIB reference time";
        String calendar "proleptic_gregorian";
    }
    time {
        String units "Hour since 2019-11-26T12:00:00Z";
        String standard_name "time";
        String long_name "GRIB forecast or observation time";
        String calendar "proleptic_gregorian";
    }
    height_above_ground {
        String units "m";
        String long_name "Specified height level above ground";
        String positive "up";
        Int32 Grib_level_type 105;
        String datum "ground";
    }
    Temperature_height_above_ground {
        String long_name "Temperature @ Specified height level above ground";
        String units "K";
        String description "Temperature";
        Float32 missing_value NaN;
        String grid_mapping "LatLon_Projection";
        String coordinates "reftime time height_above_ground lat lon ";
        String Grib_Variable_Id "VAR_85-0-1-11_L105";
        Int32 Grib1_Center 85;
        Int32 Grib1_Subcenter 0;
        Int32 Grib1_TableVersion 1;
        Int32 Grib1_Parameter 11;
        Int32 Grib1_Level_Type 105;
        String Grib1_Level_Desc "Specified height level above ground";
    }
    NC_GLOBAL {
        String Originating_or_generating_Center "Toulouse (RSMC)";
        String Originating_or_generating_Subcenter "0";
        String GRIB_table_version "0,1";
        String file_format "GRIB-1";
        String Conventions "CF-1.6";
        String history "Read using CDM IOSP GribCollection v3";
        String featureType "GRID";
    }
}
