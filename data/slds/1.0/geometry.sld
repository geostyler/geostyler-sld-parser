<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <NamedLayer>
    <Name>Geometry</Name>
    <UserStyle>
      <Title>Geometry</Title>
      <FeatureTypeStyle>
        <Rule>
          <PointSymbolizer>
            <Geometry>
              <ogc:PropertyName>geom</ogc:PropertyName>
            </Geometry>
            <Graphic>
              <Mark>
                <WellKnownName>square</WellKnownName>
              </Mark>
            </Graphic>
          </PointSymbolizer>
          <LineSymbolizer>
            <Geometry>
              <ogc:PropertyName>geom</ogc:PropertyName>
            </Geometry>
          </LineSymbolizer>
          <PolygonSymbolizer>
            <Geometry>
              <ogc:PropertyName>geom</ogc:PropertyName>
            </Geometry>
          </PolygonSymbolizer>
          <TextSymbolizer>
            <Geometry>
              <ogc:PropertyName>geom</ogc:PropertyName>
            </Geometry>
            <Label></Label>
          </TextSymbolizer>
          <LineSymbolizer>
            <Geometry>
              <ogc:Function name="startPoint">
                <ogc:PropertyName>geom</ogc:PropertyName>
              </ogc:Function>
            </Geometry>
          </LineSymbolizer>
          <LineSymbolizer>
            <Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>geom</ogc:PropertyName>
              </ogc:Function>
            </Geometry>
          </LineSymbolizer>
          <PolygonSymbolizer>
            <Geometry>
              <ogc:Function name="centroid">
                <ogc:PropertyName>geom</ogc:PropertyName>
              </ogc:Function>
            </Geometry>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
