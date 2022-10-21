<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor
  version="1.1.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:se="http://www.opengis.net/se"
>
  <NamedLayer>
    <se:Name>Function Property</se:Name>
    <UserStyle>
      <se:Name>Function Property</se:Name>
      <se:Title>Function Property</se:Title>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Function Property Rule 0</se:Name>
          <Filter xmlns="http://www.opengis.net/ogc">
            <Function name="equalTo">
              <Function name="between">
                <PropertyName>testprop</PropertyName>
                <Literal>0</Literal>
                <Literal>1</Literal>
              </Function>
              <Literal>true</Literal>
            </Function>
          </Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <SvgParameter name="fill">#FF0000</SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Function Property Rule 1</se:Name>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <SvgParameter name="fill">#FF0000</SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>12</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
