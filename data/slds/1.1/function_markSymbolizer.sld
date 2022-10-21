<?xml version="1.0" encoding="ISO-8859-1"?>
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
    <se:Name>Function MarkSymbolizer</se:Name>
    <UserStyle>
      <se:Title>Function MarkSymbolizer</se:Title>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Function MarkSymbolizer</se:Name>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>cross</se:WellKnownName>
                <se:Fill>
                  <SvgParameter name="fill">#FF0000</SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>
                <ogc:Function name="pi" />
              </se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
