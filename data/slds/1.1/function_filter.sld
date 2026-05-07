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
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Function Property Rule 0</se:Name>
          <ogc:Filter xmlns="http://www.opengis.net/ogc">
            <ogc:Function name="equalTo">
              <ogc:Function name="between">
                <ogc:PropertyName>testprop</ogc:PropertyName>
                <ogc:Literal>0</ogc:Literal>
                <ogc:Literal>1</ogc:Literal>
              </ogc:Function>
              <ogc:Literal>true</ogc:Literal>
            </ogc:Function>
          </ogc:Filter>
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
