<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
                      xmlns="http://www.opengis.net/sld"
                       xmlns:ogc="http://www.opengis.net/ogc"
                       xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <NamedLayer>
        <Name>point_geometry</Name>
        <UserStyle>
            <Title>Point at the end of a line geometry</Title>
            <Abstract>A sample style that draws a point at the end of a line</Abstract>
            <FeatureTypeStyle>
                <Rule>
                    <Name>rule1</Name>
                    <Title>Point at the end of a line geom</Title>
                    <Abstract>A red square at the end of the line</Abstract>
                    <PointSymbolizer>
                        <Geometry>
                            <ogc:Function name="endPoint">
                                <ogc:PropertyName>shape</ogc:PropertyName>
                            </ogc:Function>
                        </Geometry>
                        <Graphic>
                            <Mark>
                                <WellKnownName>square</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#FF0000</CssParameter>
                                </Fill>
                            </Mark>
                            <Size>6</Size>
                            <Rotation>
                              <ogc:Add>
                                <ogc:Function name="endAngle">
                                  <ogc:PropertyName>shape</ogc:PropertyName>
                                </ogc:Function>
                                <ogc:Literal>180</ogc:Literal>
                              </ogc:Add>
                            </Rotation>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>
